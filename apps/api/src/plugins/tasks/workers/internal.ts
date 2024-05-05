import { Worker } from 'bullmq';
import { RedisConnectionOptions } from '../../../lib/config.js';
import { server } from '../../../server.js';
import { scanAllChannels } from '../../downloads/utils.js';
import { handleScrapeTask } from '../handlers/scrapeChannel.js';
import { handleVideoStatus } from '../handlers/updateVideoStatus.js';

let internal: Worker;

export async function initInternalWorker(): Promise<void> {
	internal = new Worker(
		server.tasks.internal.name,
		async (task) => {
			try {
				switch (task.name) {
					case 'ScrapeChannel': {
						await handleScrapeTask();
						return;
					}
					case 'SyncVideoStatus': {
						await handleVideoStatus({ page: 0 });
						return;
					}
					case 'ScanChannels': {
						await scanAllChannels();
						return;
					}
				}
			} catch (err) {
				server.log.error(err);
			}

			throw new Error(`Unknown task: ${task.name}`);
		},
		{ connection: RedisConnectionOptions },
	);

	await internal.waitUntilReady();
}
