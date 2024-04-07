import { server } from '../../../server';

export async function initRepeatTasks(): Promise<void> {
	await server.tasks.internal.add(
		'syncVideos', //
		{ page: 0 },
		{ repeat: { pattern: '0 */15 * * * *' } }
	);

	await server.tasks.internal.add(
		'checkVideos', //
		{ page: 0 },
		{ repeat: { pattern: '0 */30 * * * *' } }
	);
}
