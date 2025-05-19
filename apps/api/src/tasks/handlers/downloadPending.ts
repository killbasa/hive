import { db } from '../../db/sqlite.js';
import { server } from '../../server.js';
import type { SQLWrapper } from 'drizzle-orm';
import type { TaskHandler } from '../types.js';

export const downloadPendingVideos: TaskHandler<{ videoIds: string[] }> = async ({ videoIds }) => {
	const [pendingVideoIds, runningJobs] = await Promise.all([
		db.query.videos.findMany({
			where: (video, { and, eq, or, inArray }) => {
				const whereArgs: (SQLWrapper | undefined)[] = [
					eq(video.downloadStatus, 'pending'), //
					or(eq(video.status, 'none'), eq(video.status, 'past')),
				];

				if (videoIds.length > 0) {
					whereArgs.push(inArray(video.id, videoIds));
				}

				return and(...whereArgs);
			},
			columns: { id: true, channelId: true, status: true },
		}),
		server.tasks.downloader.getJobs(['active', 'waiting']),
	]);

	const runningJobsIds = runningJobs.map((job) => job.data.videoId);
	const newVideoIds = pendingVideoIds.filter((video) => !runningJobsIds.includes(video.id));
	const groupedVideos = Object.groupBy(newVideoIds, (video) => video.channelId);

	const videosArr: { videoId: string; channelId: string }[] = [];

	if (videosArr.length === 0) {
		server.log.debug('no new videos to download');
	}

	for (const [channelId, videos] of Object.entries(groupedVideos)) {
		if (videos === undefined) {
			continue;
		}

		for (const video of videos) {
			if (video.status === 'live') {
				await server.tasks.downloader.add(
					`video/${video.id}`,
					{
						type: 'video',
						videoId: video.id,
						channelId: video.channelId,
						live: true,
					},
					{
						jobId: `video/${video.id}/download`,
						priority: 1,
					},
				);
			} else {
				videosArr.push({ videoId: video.id, channelId });
			}
		}
	}

	for (const video of videosArr) {
		await server.tasks.downloader.add(
			`video/${video.videoId}`,
			{
				type: 'video',
				videoId: video.videoId,
				channelId: video.channelId,
				live: false,
			},
			{
				jobId: `video/${video.videoId}/download`,
				priority: 2,
			},
		);
	}
};
