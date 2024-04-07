import { initRepeatTasks as initRepeatHandlers } from './handlers/repeat';
import { initDownloaderWorker } from './workers/downloader';
import { initScannerWorker } from './workers/scanner';
import { initInternalWorker } from './workers/internal';
import { server } from '../../server';

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
