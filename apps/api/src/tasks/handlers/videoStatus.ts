import { db } from '../../db/sqlite.js';
import { videos } from '../../db/schema.js';
import { fetchVideos } from '../../lib/youtube/videos.js';
import { server } from '../../server.js';
import { eq } from 'drizzle-orm';
import { setTimeout } from 'node:timers';
import type { SQLWrapper } from 'drizzle-orm';
import type { YouTubeVideo } from '../../lib/youtube/videos.js';
import type { VideoStatus } from '../../plugins/videos/schema.js';
import type { TaskHandler } from '../types.js';

export const handleVideoStatus: TaskHandler<{ page: number; status: VideoStatus[] }> = async ({ page, status }): Promise<void> => {
	server.log.info(`checking videos (page: ${page + 1})`);

	const result = await db.query.videos.findMany({
		where: (videos, { eq, or }) => {
			const where: (SQLWrapper | undefined)[] = [];

			for (const s of status) {
				where.push(eq(videos.status, s));
			}

			return or(...where);
		},
		orderBy: (videos, { asc }) => [asc(videos.updatedAt)],
		columns: { id: true, status: true, channelId: true, title: true },
		offset: page * 50,
		limit: 50,
	});

	const videoIds = result.map((row) => row.id);
	const ytVideos = await fetchVideos(videoIds);

	if (!Array.isArray(ytVideos)) {
		server.log.error('ytVideos is not an array');
		server.log.error(JSON.stringify({ ctx: ytVideos }));
		return;
	}

	await processVideos(result, ytVideos);

	if (result.length === 50) {
		setTimeout(async () => {
			await handleVideoStatus({
				page: page + 1,
				status,
			});
		}, 1000);
	} else {
		server.log.info(`checked status of ${page * 50 + result.length} videos`);
	}
};

async function processVideos(
	dbVideos: {
		id: string;
		channelId: string;
		title: string;
		status: VideoStatus;
	}[],
	ytVideos: YouTubeVideo[],
): Promise<void> {
	await Promise.all(
		ytVideos.map((video) => {
			const dbVideo = dbVideos.find((row) => row.id === video.id);
			if (!dbVideo) {
				throw new Error(`Video not found in database (${video.id})`);
			}

			let status: VideoStatus = 'none';

			if (video.liveStreamingDetails) {
				const { actualEndTime, actualStartTime, scheduledStartTime } = video.liveStreamingDetails;

				if (actualEndTime) {
					status = 'past';

					if (dbVideo.status === 'live') {
						server.notifications.emit('livestream', {
							status: 'end',
							videoId: video.id,
							title: dbVideo.title,
						});
					}
				} else if (actualStartTime) {
					status = 'live';

					if (dbVideo.status === 'upcoming') {
						server.notifications.emit('livestream', {
							status: 'start',
							videoId: video.id,
							title: dbVideo.title,
						});
					}
				} else if (scheduledStartTime) {
					const data = new Date(scheduledStartTime).getTime() - Date.now();

					if (data < 0) {
						status = 'live';
					} else {
						status = 'upcoming';
					}
				}
			}

			return db //
				.update(videos)
				.set({
					status,
					updatedAt: new Date(),
				})
				.where(eq(videos.id, video.id));
		}),
	);
}
