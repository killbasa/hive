import { server } from '../../../server.js';

export async function initRepeatTasks(): Promise<void> {
	await server.tasks.internal.add(
		'ScrapeChannel', //
		{ page: 0 },
		{ repeat: { pattern: '0 */15 * * * *' } }
	);

	await server.tasks.internal.add(
		'SyncVideoStatus', //
		{ page: 0 },
		{ repeat: { pattern: '0 */30 * * * *' } }
	);

	await Promise.all([
		setScanCronTask(), //
		setDownloadCronTask()
	]);
}

export async function setScanCronTask(pattern?: string): Promise<void> {
	if (pattern === undefined) {
		const { cronSubscription } = await server.settings.get();
		pattern = cronSubscription;
	}

	await server.tasks.internal.remove('ScanChannels');
	await server.tasks.internal.add(
		'ScanChannels', //
		undefined,
		{
			jobId: 'ScanChannels',
			repeat: { pattern }
		}
	);
}

export async function setDownloadCronTask(pattern?: string): Promise<void> {
	if (pattern === undefined) {
		const { cronDownload } = await server.settings.get();
		pattern = cronDownload;
	}

	await server.tasks.internal.remove('DownloadPending');
	await server.tasks.internal.add(
		'DownloadPending', //
		undefined,
		{
			jobId: 'DownloadPending',
			repeat: { pattern }
		}
	);
}
