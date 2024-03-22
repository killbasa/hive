import { RedisConnectionOptions } from '../lib/config';
import { Queue } from 'bullmq';
import type { QueueOptions } from 'bullmq';
import type { DownloaderTasks } from '../workers/downloader';

export let downloader: Queue<DownloaderTasks>;

export async function initDownloaderQueue(): Promise<void> {
	const options: QueueOptions = {
		connection: RedisConnectionOptions,
		defaultJobOptions: {
			removeOnComplete: true
		}
	};

	downloader = new Queue('downloader', options);
	await downloader.waitUntilReady();
}
