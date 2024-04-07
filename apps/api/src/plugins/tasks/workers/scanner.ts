import { RedisConnectionOptions } from '../../../lib/config';
import { server } from '../../../server';
import { handleChannelScanTask, handleDownloadChannelTask } from '../handlers/scanner';
import { Worker } from 'bullmq';

let scanner: Worker;

export type ScannerTasks = ScannerDownloadChannelTask | ScannerScanChannelTask;

export type ScannerDownloadChannelTask = { type: 'channel'; channelId: string };
export type ScannerScanChannelTask = { type: 'scan'; channelId: string; position: number; total: number };

export async function initScannerWorker(): Promise<void> {
	scanner = new Worker(
		'scanner',
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
		{ connection: RedisConnectionOptions, concurrency: 1 }
	);

	await scanner.waitUntilReady();
}
