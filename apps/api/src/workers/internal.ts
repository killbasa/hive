import { RedisConnectionOptions } from '../lib/config';
import { handleScrapeTask } from '../tasks/scrapeVideos';
import { handleVideoStatus } from '../tasks/updateVideoStatus';
import { server } from '../server';
import { Worker } from 'bullmq';

let internal: Worker;

export async function initInternalWorker(): Promise<void> {
	internal = new Worker(
		'internal',
		async (task) => {
			try {
				switch (task.name) {
					case 'scrapeChannelXML': {
						await handleScrapeTask();
						return;
					}
					case 'checkVideos': {
						await handleVideoStatus();
						return;
					}
				}
			} catch (err) {
				server.log.error(err);
			}

			throw new Error(`Unknown task: ${task.name}`);
		},
		{ connection: RedisConnectionOptions }
	);

	await internal.waitUntilReady();
}
