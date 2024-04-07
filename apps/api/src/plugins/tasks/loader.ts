import { initRepeatTasks as initRepeatHandlers } from './handlers/repeat.js';
import { initDownloaderWorker } from './workers/downloader.js';
import { initScannerWorker } from './workers/scanner.js';
import { initInternalWorker } from './workers/internal.js';
import { server } from '../../server.js';

export async function initWorkers(): Promise<void> {
	await Promise.all([
		initScannerWorker(), //
		initDownloaderWorker(),
		initInternalWorker()
	]);

	server.log.info('started workers');
}

export async function initHandlers(): Promise<void> {
	await Promise.all([
		initRepeatHandlers() //
	]);

	server.log.info('started handlers');
}
