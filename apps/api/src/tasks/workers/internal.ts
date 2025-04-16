import { scanAllChannels } from '../../plugins/videos/utils.js';
import { server } from '../../server.js';
import { downloadPendingVideos } from '../handlers/downloadPending.js';
import { handleVideoStatus } from '../handlers/videoStatus.js';
import { Worker } from 'bullmq';

let internal: Worker;

export async function initInternalWorker(): Promise<void> {
	internal = new Worker(
		server.tasks.internal.name,
		async (task) => {
			try {
				switch (task.name) {
					case 'SyncVideoStatus': {
						await handleVideoStatus({
							page: 0,
							status: ['unknown', 'upcoming', 'live'],
						});
						return;
					}
					case 'ScanChannels': {
						await scanAllChannels();
						return;
					}
					case 'DownloadPending': {
						if (process.env.DISABLE_AUTODL !== 'true') {
							await downloadPendingVideos({ videoIds: [] });
						}
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
			connection: {
				host: server.config.redis.host,
				port: server.config.redis.port,
				password: server.config.redis.password,
			},
		},
	);

	await internal.waitUntilReady();
}
