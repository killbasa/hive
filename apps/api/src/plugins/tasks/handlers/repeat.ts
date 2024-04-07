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

	const { cronSubscription, cronDownload } = await server.settings.get();

	await server.tasks.internal.add(
		'ScanChannels', //
		{ page: 0 },
		{ repeat: { pattern: cronSubscription } }
	);

	await server.tasks.internal.add(
		'DownloadPending', //
		{ page: 0 },
		{ repeat: { pattern: cronDownload } }
	);
}
