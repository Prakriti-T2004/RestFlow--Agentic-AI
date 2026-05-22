import { Queue, QueueScheduler } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

export const sessionQueueName = 'session-processing-queue';

let connection: IORedis | null = null;
let sessionQueue: Queue | null = null;
let sessionQueueScheduler: QueueScheduler | null = null;

if (redisUrl) {
	connection = new IORedis(redisUrl, {
		maxRetriesPerRequest: null,
	});

	// Provide a queue and scheduler for session jobs only when Redis is configured
	sessionQueue = new Queue(sessionQueueName, { connection });
	sessionQueueScheduler = new QueueScheduler(sessionQueueName, { connection });
	console.log('[Queue] Redis enabled for session processing');
} else {
	console.log('[Queue] Redis disabled - falling back to in-process session execution');
}

export { connection, sessionQueue, sessionQueueScheduler };

export default { sessionQueue, sessionQueueScheduler, connection };
