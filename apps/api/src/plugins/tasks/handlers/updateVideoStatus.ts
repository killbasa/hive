import { db } from '../../../db/client.js';
import { videos } from '../../../db/schema.js';
import { fetchVideos } from '../../../lib/youtube/videos.js';
import { server } from '../../../server.js';
import { eq } from 'drizzle-orm';

export async function handleVideoStatus(page = 0): Promise<void> {
	server.log.info(`checking videos... (page: ${page})`);

	const result = await db.query.videos.findMany({
		where: (videos, { eq, or }) => {
			return or(
				eq(videos.status, 'new'), //
				eq(videos.status, 'upcoming'),
				eq(videos.status, 'live')
			);
		},
		orderBy: (videos, { asc }) => [asc(videos.updatedAt)],
		columns: { id: true, status: true, channelId: true, title: true },
		limit: page * 50 + 50
	});

	const videoIds = result.map((row) => row.id);
	const ytVideos = await fetchVideos(videoIds);

	await Promise.all(
		// eslint-disable-next-line @typescript-eslint/promise-function-async
		ytVideos.map(async (video) => {
			const dbVideo = result.find((row) => row.id === video.id);
			if (!dbVideo) {
				throw new Error(`Video not found in database (${video.id})`);
			}

			let status: 'live' | 'none' | 'past' | 'upcoming' = 'none';

			if (video.liveStreamingDetails) {
				const { actualStartTime, actualEndTime } = video.liveStreamingDetails;

				if (actualEndTime) {
					status = 'past';

					if (dbVideo.status === 'live') {
						server.notifications.emit('livestream', {
							status: 'end',
							videoId: video.id,
							title: dbVideo.title
						});
					}
				} else if (actualStartTime) {
					status = 'live';

					if (dbVideo.status === 'upcoming') {
						await server.tasks.downloader.add(
							`video/${video.id}`, //
							{
								type: 'video',
								videoId: video.id,
								channelId: dbVideo.channelId,
								live: true
							},
							{ priority: 1 }
						);

						server.notifications.emit('livestream', {
							status: 'start',
							videoId: video.id,
							title: dbVideo.title
						});
					}
				} else {
					status = 'upcoming';
				}
			}

			return await db //
				.update(videos)
				.set({ status, updatedAt: new Date() })
				.where(eq(videos.id, video.id));
		})
	);

	if (result.length === 50) {
		setTimeout(async () => {
			await handleVideoStatus(page + 1);
		}, 1000);
	} else {
		server.log.info(`checked ${page * 50 + result.length} videos. Done!`);
	}
}

export async function checkNewVideos(page = 0): Promise<void> {
	await new Promise<void>(async (resolve) => {
		server.log.info(`checking new videos... (page: ${page})`);

		const result = await db.query.videos.findMany({
			where: (videos, { eq }) => eq(videos.status, 'new'),
			columns: { id: true, status: true, channelId: true, title: true },
			limit: page * 50 + 50
		});

		const videoIds = result.map((row) => row.id);
		const ytVideos = await fetchVideos(videoIds);

		await Promise.all(
			// eslint-disable-next-line @typescript-eslint/promise-function-async
			ytVideos.map(async (video) => {
				const dbVideo = result.find((row) => row.id === video.id);
				if (!dbVideo) {
					throw new Error(`Video not found in database (${video.id})`);
				}

				let status: 'live' | 'none' | 'past' | 'upcoming' = 'none';

				if (video.liveStreamingDetails) {
					const { actualStartTime, actualEndTime } = video.liveStreamingDetails;

					if (actualEndTime) {
						status = 'past';

						if (dbVideo.status === 'live') {
							server.notifications.emit('livestream', {
								status: 'end',
								videoId: video.id,
								title: dbVideo.title
							});
						}
					} else if (actualStartTime) {
						status = 'live';

						if (dbVideo.status === 'upcoming') {
							await server.tasks.downloader.add(
								`video/${video.id}`, //
								{
									type: 'video',
									videoId: video.id,
									channelId: dbVideo.channelId,
									live: true
								},
								{ priority: 1 }
							);

							server.notifications.emit('livestream', {
								status: 'start',
								videoId: video.id,
								title: dbVideo.title
							});
						}
					} else {
						status = 'upcoming';
					}
				}

				return await db //
					.update(videos)
					.set({ status, updatedAt: new Date() })
					.where(eq(videos.id, video.id));
			})
		);

		if (result.length === 50) {
			setTimeout(async () => {
				await checkNewVideos(page + 1);
				resolve();
			}, 1000);
		} else {
			server.log.info(`checked ${page * 50 + result.length} new videos. Done!`);
			resolve();
		}
	});
}
