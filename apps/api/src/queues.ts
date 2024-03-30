import { initDownloaderQueue } from './queues/downloader';
import { initScannerQueue } from './queues/scanner';
import { initInternalQueue } from './queues/internal';
import { server } from './server';
import { initRepeatTasks } from './tasks/repeat';
import { initDownloaderWorker } from './workers/downloader';
import { initScannerWorker } from './workers/scanner';
import { initInternalWorker } from './workers/internal';

export async function initQueues(): Promise<void> {
	await Promise.all([
		initScannerQueue(), //
		initDownloaderQueue(),
		initInternalQueue()
	]);

	server.log.info('Started queues');
}

export async function initWorkers(): Promise<void> {
	await Promise.all([
		initScannerWorker(), //
		initDownloaderWorker(),
		initInternalWorker()
	]);

	server.log.info('Started workers');
}

export async function initTasks(): Promise<void> {
	await Promise.all([
		initRepeatTasks() //
	]);

	server.log.info('Scheduled tasks');
}
