import { db } from '../db/client';
import { downloader } from '../queues/downloader';
import type { FastifyPluginCallback } from 'fastify';

export const downloadsRoutes: FastifyPluginCallback = (server, _, done) => {
	server.get(
		'/queue', //
		async (_, reply): Promise<void> => {
			const tasks = await downloader.getJobs('waiting');

			await reply.send({
				waiting: tasks.map((task) => task.data)
			});
		}
	);

	server.post(
		'/start', //
		async (_, reply): Promise<void> => {
			const videoIds = await db.query.videos.findMany({
				where: (video, { and, eq, or }) => {
					return and(
						eq(video.downloadStatus, 'pending'), //
						or(eq(video.status, 'none'), eq(video.status, 'past'))
					);
				},
				columns: { id: true, channelId: true, status: true }
			});

			const videosArr: { videoId: string; channelId: string }[] = [];
			const arr = Object.groupBy(videoIds, (video) => video.channelId);

			for (const [channelId, videos] of Object.entries(arr)) {
				if (videos === undefined) continue;

				for (const video of videos) {
					if (video.status === 'live') {
						await downloader.add(
							`video/${video.id}`,
							{
								type: 'video',
								videoId: video.id,
								channelId: video.channelId,
								live: true
							},
							{ priority: 1 }
						);
					} else {
						videosArr.push({ videoId: video.id, channelId });
					}
				}
			}

			for (const video of videosArr) {
				await downloader.add(`video/${video.videoId}`, {
					type: 'video',
					videoId: video.videoId,
					channelId: video.channelId,
					live: false
				});
			}

			await reply.send();
		}
	);

	done();
};
