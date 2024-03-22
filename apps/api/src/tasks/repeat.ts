import { internal } from '../queues/internal';

export async function initRepeatTasks(): Promise<void> {
	await internal.add(
		'syncVideos', //
		{ page: 0 },
		{ repeat: { pattern: '0 */15 * * * *' } }
	);

	await internal.add(
		'checkVideos', //
		{ page: 0 },
		{ repeat: { pattern: '0 */30 * * * *' } }
	);
}
