import { RedisConnectionOptions } from '../lib/config';
import { Queue } from 'bullmq';
import type { QueueOptions } from 'bullmq';
import type { ScannerTasks } from '../workers/scanner';

export let scanner: Queue<ScannerTasks>;

export async function initScannerQueue(): Promise<void> {
	const options: QueueOptions = {
		connection: RedisConnectionOptions,
		defaultJobOptions: {
			removeOnComplete: true,
			removeOnFail: true
		}
	};

	scanner = new Queue('scanner', options);
	await scanner.waitUntilReady();
}
