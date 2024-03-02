import { config } from '../lib/config';
import { fetchChannelXML, parseChannelXML } from '../lib/xml';
import { Time, sleep } from '../lib/utils';
import { db } from '../db/pool';
import { channels } from '../db/schema';
import { Worker } from 'bullmq';
import type { Job, WorkerOptions } from 'bullmq';

let worker: Worker;

export async function initWorkers(): Promise<void> {
	const options: WorkerOptions = {
		connection: {
			host: config.REDIS_HOST,
			port: config.REDIS_PORT,
			password: config.REDIS_PASSWORD
		}
	};

	worker = new Worker(
		'internal',
		async (job: Job) => {
			switch (job.name) {
				case 'syncVideos': {
					await syncVideos();
					break;
				}
				case 'checkVideos': {
					await checkVideos();
					break;
				}
				default:
					throw new Error(`Unknown job: ${job.name}`);
			}
		},
		options
	);

	await Promise.all([
		worker.waitUntilReady() //
	]);
}

async function syncVideos(): Promise<void> {
	console.log('Syncing videos...');

	const result = await db
		.select({
			field1: channels.id
		})
		.from(channels)
		.limit(3);

	for (const channel of result) {
		const xml = await fetchChannelXML(channel.field1);
		const json = parseChannelXML(xml);

		console.log(json);

		await sleep(Time.Second);
	}
}

async function checkVideos(): Promise<void> {
	console.log('Checking videos...');
}
