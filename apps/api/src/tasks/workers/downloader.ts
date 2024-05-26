import { RedisConnectionOptions } from '../../lib/config.js';
import { server } from '../../server.js';
import { handleDownloadVideoTask } from '../handlers/downloader.js';
import { Worker } from 'bullmq';

let downloader: Worker;

export async function initDownloaderWorker(): Promise<void> {
	downloader = new Worker(
		server.tasks.downloader.name,
		async (task) => {
			try {
				switch (task.data.type) {
					case 'video': {
						await handleDownloadVideoTask(task.data);
						return;
					}
				}
			} catch (err) {
				// TODO improve error message
				server.log.error(err);
			}

			throw new Error(`Unknown task: ${task.name}`);
		},
		{
			connection: RedisConnectionOptions,
			concurrency: 1,
		},
	);

	await downloader.waitUntilReady();
}
