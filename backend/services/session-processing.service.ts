import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import SessionModel from '../models/Session';
import orchestrator from './orchestrator.service';
import { supabaseAdmin } from '../integrations/supabase/client.server';
import { isLikelyMeaningfulSessionText, normalizeSessionText, qualityLabel } from './session-input.service';

const uploadsDir = path.join(__dirname, '../uploads');
try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch {}

function runPythonExtractor(localPath: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const pythonPath = path.join(__dirname, '../tools/extract_text.py');
		const proc = spawn('python', [pythonPath, localPath], { stdio: ['ignore', 'pipe', 'pipe'] });
		let out = '';
		let err = '';
		proc.stdout.on('data', (chunk: Buffer) => { out += chunk.toString(); });
		proc.stderr.on('data', (chunk: Buffer) => { err += chunk.toString(); });
		proc.on('close', (code: number) => {
			if (code === 0) return resolve(out.trim());
			reject(new Error(`Extractor failed (${code}): ${err}`));
		});
	});
}

async function downloadFromSupabase(fileName: string, localPath: string) {
	const bucket = 'resumes';
	const { data, error } = await supabaseAdmin.storage.from(bucket).download(fileName);
	if (error) throw error;

	if ((data as any)?.arrayBuffer) {
		const buf = Buffer.from(await (data as any).arrayBuffer());
		fs.writeFileSync(localPath, buf);
		return;
	}

	if ((data as any)?.pipe) {
		const stream = data as unknown as NodeJS.ReadableStream;
		const ws = fs.createWriteStream(localPath);
		await new Promise((resolve, reject) => {
			stream.pipe(ws);
			ws.on('finish', () => resolve(undefined));
			ws.on('error', reject);
		});
		return;
	}

	throw new Error('Unsupported Supabase download payload');
}

function previewText(value: string, limit = 240) {
	const singleLine = value.replace(/\s+/g, ' ').trim();
	return singleLine.length > limit ? `${singleLine.slice(0, limit)}...` : singleLine;
}

async function recordProcessingTrace(sessionId: string, stage: string, message: string, details?: string, progress?: number) {
	console.log(`[SessionProcessor:${sessionId}] ${stage} - ${message}${details ? ` | ${details}` : ''}`);
	await SessionModel.updateOne({ _id: sessionId }, {
		$set: typeof progress === 'number' ? { progress, currentStep: stage } : { currentStep: stage },
		$push: {
			activityLog: {
				stage,
				message,
				details,
				createdAt: new Date(),
			},
		},
	}).exec();
}

export async function processSessionPayload(input: {
	sessionId: string;
	fileName?: string | null;
	localPath?: string | null;
}) {
	const { sessionId, fileName, localPath } = input;
	const session = await SessionModel.findById(sessionId).exec();
	if (!session) throw new Error('Session not found');

	let extractedPath: string | null = null;
	try {
		await SessionModel.updateOne({ _id: sessionId }, { $set: { status: 'running' } }).exec();
		await recordProcessingTrace(
			sessionId,
			'queued-for-processing',
			'The session has entered the processing pipeline and is waiting for resume analysis.',
			fileName ? `Uploaded file: ${fileName}` : 'Processing inline resume/context payload',
			4,
		);

		if (localPath) {
			extractedPath = localPath;
		} else if (fileName) {
			extractedPath = path.join(uploadsDir, `${sessionId}_${Date.now()}${path.extname(fileName)}`);
			await recordProcessingTrace(
				sessionId,
				'downloading-resume',
				'Fetching the uploaded resume from storage so the agent can inspect the raw file.',
				`File name: ${fileName}`,
				10,
			);
			await downloadFromSupabase(fileName, extractedPath);
		}

		if (extractedPath) {
			await recordProcessingTrace(
				sessionId,
				'extracting-text',
				'Reading the document and converting it into text that the planner can reason over.',
				'Running Python extractor on the uploaded file',
				22,
			);
			const extracted = await runPythonExtractor(extractedPath);
			const normalizedExtracted = normalizeSessionText(extracted);
			console.log(`[SessionProcessor:${sessionId}] python-extracted-length=${normalizedExtracted.length}`);
			console.log(`[SessionProcessor:${sessionId}] python-extracted-preview=${previewText(normalizedExtracted)}`);
			if (!isLikelyMeaningfulSessionText(normalizedExtracted, { minLength: 80, minWords: 12 })) {
				throw new Error('The uploaded resume did not contain enough usable content. Please upload a clearer resume or paste richer context.');
			}
			await recordProcessingTrace(
				sessionId,
				'resume-extracted',
				'Resume text extracted successfully and attached to the session.',
				`${qualityLabel(normalizedExtracted)} | preview: ${previewText(normalizedExtracted)}`,
				34,
			);
			await SessionModel.updateOne({ _id: sessionId }, {
				$set: { resumeText: normalizedExtracted },
			}).exec();
		}

		await orchestrator.orchestrateSession(sessionId);
		console.log('[SessionProcessor] Orchestration complete for', sessionId);
		return { success: true };
	} catch (err) {
		await SessionModel.updateOne({ _id: sessionId }, {
			$set: { status: 'failed', currentStep: 'failed' },
			$push: {
				activityLog: {
					stage: 'failed',
					message: err instanceof Error ? err.message : 'The processing pipeline failed before completion.',
					createdAt: new Date(),
				},
			},
		}).exec().catch(() => undefined);
		throw err;
	} finally {
		if (extractedPath && extractedPath !== localPath) {
			try { fs.unlinkSync(extractedPath); } catch {}
		}
	}
}
