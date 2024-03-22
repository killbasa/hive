import { RedisConnectionOptions } from '../lib/config';
import { Queue } from 'bullmq';
import type { QueueOptions } from 'bullmq';

export let internal: Queue;

export async function initInternalQueue(): Promise<void> {
	const options: QueueOptions = {
		connection: RedisConnectionOptions,
		defaultJobOptions: {
			removeOnComplete: true
		}
	};

	internal = new Queue('internal', options);
	await internal.waitUntilReady();
}
