import { Worker } from 'bullmq';
import { RedisConnectionOptions } from '../../../lib/config.js';
import { server } from '../../../server.js';
import { handleChannelScanTask, handleDownloadChannelTask } from '../handlers/scanner.js';

let scanner: Worker;

export async function initScannerWorker(): Promise<void> {
	scanner = new Worker(
		server.tasks.scanner.name,
		async (task) => {
			try {
				switch (task.data.type) {
					case 'channel': {
						await handleDownloadChannelTask(task.data);
						return;
					}
					case 'scan': {
						await handleChannelScanTask(task.data);
						return;
					}
				}
			} catch (err) {
				server.log.error(err);
			}

			throw new Error(`Unknown task: ${task.name}`);
		},
		{ connection: RedisConnectionOptions, concurrency: 1 },
	);

	await scanner.waitUntilReady();
}
