import { RedisConnectionOptions } from '../lib/config';
import { Queue } from 'bullmq';
import type { QueueOptions } from 'bullmq';
import type { IndexerTasks } from '../workers/indexer';

export let indexer: Queue<IndexerTasks>;

export async function initIndexerQueue(): Promise<void> {
	const options: QueueOptions = {
		connection: RedisConnectionOptions,
		defaultJobOptions: {
			removeOnComplete: true
		}
	};

	indexer = new Queue('indexer', options);
	await indexer.waitUntilReady();
}
