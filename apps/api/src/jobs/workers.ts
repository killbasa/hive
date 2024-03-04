import { config } from '../lib/config';
import { fetchChannelXML, parseChannelXML } from '../lib/xml';
import { db } from '../db/pool';
import { channels, videos } from '../db/schema';
import { fetchVideos } from '../lib/youtube/videos';
import { fetchChannels } from '../lib/youtube/channels';
import { Time, sleep } from '../lib/utils';
import { Worker } from 'bullmq';
import { eq } from 'drizzle-orm';
import type { Job, WorkerOptions } from 'bullmq';

let worker: Worker;

export async function initWorkers(): Promise<void> {
	console.log('Starting workers');

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

export async function syncVideos(): Promise<void> {
	console.log('Syncing videos');

	const result = await db
		.select({
			field1: channels.id
		})
		.from(channels)
		.limit(3);

	for (const channel of result) {
		const xml = await fetchChannelXML(channel.field1);
		const data = parseChannelXML(xml);

		await db
			.insert(videos)
			.values(
				data.feed.entry.map((entry) => {
					return {
						id: entry['yt:videoId'],
						channelId: entry['yt:channelId'],
						title: entry.title,
						thumbnail: `https://i.ytimg.com/vi/${entry['yt:videoId']}/maxresdefault.jpg`,
						status: 'new' as const
					};
				})
			)
			.onConflictDoNothing({ target: videos.id });

		await sleep(Time.Second);
	}
}

// TODO: handling chunking
export async function checkVideos(): Promise<void> {
	console.log('Checking videos');

	const result = await db
		.select({
			field1: videos.id
		})
		.from(videos)
		.where(eq(videos.status, 'new'))
		.limit(50);

	const videoIds = result.map((row) => row.field1);
	const ytVideos = await fetchVideos(videoIds);

	await Promise.all(
		// eslint-disable-next-line @typescript-eslint/promise-function-async
		ytVideos.map((video) => {
			let status: 'live' | 'none' | 'past' | 'upcoming' = 'none';

			if (video.liveStreamingDetails) {
				const { actualStartTime, actualEndTime } = video.liveStreamingDetails;

				if (actualEndTime) {
					status = 'past';
				} else if (actualStartTime) {
					status = 'live';
				} else {
					status = 'upcoming';
				}
			}

			return db //
				.update(videos)
				.set({ status })
				.where(eq(videos.id, video.id));
		})
	);
}

export async function syncChannelMetadata(): Promise<void> {
	console.log('Checking channels');

	const result = await db
		.select({
			field1: channels.id
		})
		.from(channels)
		.limit(50);

	const channelIds = result.map((row) => row.field1);
	const ytChannels = await fetchChannels(channelIds);

	await Promise.all(
		// eslint-disable-next-line @typescript-eslint/promise-function-async
		ytChannels.map((channel) => {
			return db //
				.update(channels)
				.set({
					name: channel.snippet.title,
					photo: channel.snippet.thumbnails.high.url,
					customUrl: channel.snippet.customUrl
				})
				.where(eq(channels.id, channel.id));
		})
	);
}
