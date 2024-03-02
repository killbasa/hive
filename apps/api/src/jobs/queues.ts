import { config } from '../lib/config';
import { Queue } from 'bullmq';
import type { QueueOptions } from 'bullmq';

export let notifications: Queue;

let internal: Queue;

export async function initQueues(): Promise<void> {
	const options: QueueOptions = {
		connection: {
			host: config.REDIS_HOST,
			port: config.REDIS_PORT,
			password: config.REDIS_PASSWORD
		},
		defaultJobOptions: {
			removeOnComplete: true
		}
	};

	notifications = new Queue('notifications', options);
	internal = new Queue('internal', options);

	await Promise.all([
		notifications.waitUntilReady(), //
		internal.waitUntilReady()
	]);
}

export async function initJobs(): Promise<void> {
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
