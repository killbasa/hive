import { RedisConnectionOptions } from '../../../lib/config';
import { server } from '../../../server';
import { handleDownloadVideoTask } from '../handlers/downloader';
import { Worker } from 'bullmq';

let downloader: Worker;

export type DownloaderTasks = DownloaderVideoTask;

export type DownloaderVideoTask = { type: 'video'; videoId: string; channelId: string; live: boolean };

export async function initDownloaderWorker(): Promise<void> {
	downloader = new Worker(
		'downloader',
		async (task) => {
			try {
				switch (task.data.type) {
					case 'video': {
						await handleDownloadVideoTask(task.data);
						return;
					}
				}
			} catch (err) {
				server.log.error(err);
			}

			throw new Error(`Unknown task: ${task.name}`);
		},
		{ connection: RedisConnectionOptions, concurrency: 1 }
	);

	await downloader.waitUntilReady();
}
