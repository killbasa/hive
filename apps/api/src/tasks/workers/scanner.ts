import { config } from '../../lib/config.js';
import { server } from '../../server.js';
import { handleChannelScanTask, handleDownloadChannelTask } from '../handlers/scanner.js';
import { Worker } from 'bullmq';

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
				// TODO improve error message
				server.log.error(err);
			}

			throw new Error(`Unknown task: ${task.name}`);
		},
		{
			connection: {
				host: config.REDIS_HOST,
				port: config.REDIS_PORT,
				password: config.REDIS_PASSWORD,
			},
			concurrency: 1,
		},
	);

	await scanner.waitUntilReady();
}
