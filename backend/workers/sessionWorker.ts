import { Worker, Job } from 'bullmq';
import dotenv from 'dotenv';
import { connection } from '../queues';
import { processSessionPayload } from '../services/session-processing.service';

dotenv.config();
if (!connection) {
  console.log('Session worker not started because REDIS_URL is not configured');
  process.exit(0);
}

const worker = new Worker('session-processing-queue', async (job: Job) => {
  console.log('Worker processing job', job.id, job.name, job.data);
  const { sessionId, fileName } = job.data as { sessionId: string; fileName: string | null };
  return processSessionPayload({ sessionId, fileName });
}, { connection });

worker.on('completed', (job) => {
  console.log('Job completed', job.id);
});
worker.on('failed', (job, err) => {
  console.error('Job failed', job?.id, err.message || err);
});

console.log('Session worker started');
