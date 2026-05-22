import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import SessionModel from '../models/Session';
import orchestrator from './orchestrator.service';
import { supabaseAdmin } from '../integrations/supabase/client.server';

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
		await SessionModel.updateOne({ _id: sessionId }, {
			$set: {
				status: 'running',
				progress: 4,
				currentStep: 'queued-for-processing',
			},
			$push: {
				activityLog: {
					stage: 'queued-for-processing',
					message: 'The session has entered the processing pipeline and is waiting for resume analysis.',
					createdAt: new Date(),
				},
			},
		}).exec();

		if (localPath) {
			extractedPath = localPath;
		} else if (fileName) {
			extractedPath = path.join(uploadsDir, `${sessionId}_${Date.now()}${path.extname(fileName)}`);
			await SessionModel.updateOne({ _id: sessionId }, {
				$set: { progress: 10, currentStep: 'downloading-resume' },
				$push: {
					activityLog: {
						stage: 'downloading-resume',
						message: 'Fetching the uploaded resume from storage so the agent can inspect the raw file.',
						createdAt: new Date(),
					},
				},
			}).exec();
			await downloadFromSupabase(fileName, extractedPath);
		}

		if (extractedPath) {
			console.log('[SessionProcessor] Extracting resume text for session', sessionId);
			await SessionModel.updateOne({ _id: sessionId }, {
				$set: { progress: 22, currentStep: 'extracting-text' },
				$push: {
					activityLog: {
						stage: 'extracting-text',
						message: 'Reading the document and converting it into text that the planner can reason over.',
						createdAt: new Date(),
					},
				},
			}).exec();
			const extracted = await runPythonExtractor(extractedPath);
			await SessionModel.updateOne({ _id: sessionId }, {
				$set: {
					resumeText: extracted,
					progress: 34,
					currentStep: 'resume-extracted',
				},
				$push: {
					activityLog: {
						stage: 'resume-extracted',
						message: 'Resume text extracted successfully and attached to the session.',
						createdAt: new Date(),
					},
				},
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
