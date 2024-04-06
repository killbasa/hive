import { db } from '../db/client';
import { StatusEvent } from '../lib/utils';
import { downloader } from '../queues/downloader';
import { scanner } from '../queues/scanner';
import { downloadControllers } from '../tasks/downloader';
import { scansInProgress } from '../tasks/scanner';
import { checkToken } from '../lib/auth';
import { z } from 'zod';
import type { FastifyPluginCallback } from 'fastify';
import type { SQLWrapper } from 'drizzle-orm';

export const downloadsRoutes: FastifyPluginCallback = (server, _, done) => {
	server.addHook('onRequest', checkToken);

	server.get(
		'/queue', //
		{ schema: { tags: ['Downloads'] } },
		async (_, reply): Promise<void> => {
			const tasks = await downloader.getJobs('waiting');

			await reply.send({
				queue: tasks.map((task) => task.data)
			});
		}
	);

	server.get(
		'/current', //
		{ schema: { tags: ['Downloads'] } },
		async (_, reply): Promise<void> => {
			const task = await downloader.getActive(0, 1);
			if (task.length === 0) {
				return await reply.send({
					current: undefined
				});
			}

			const video = await db.query.videos.findFirst({
				where: (video, { eq }) => eq(video.id, task[0].data.videoId),
				columns: { id: true, channelId: true, title: true }
			});

			await reply.send({
				current: video
			});
		}
	);

	const DownloadStartSchema = z.object({
		videoIds: z.array(z.string()).optional()
	});

	server.post(
		'/start', //
		{ schema: { tags: ['Downloads'] } },
		async (request, reply): Promise<void> => {
			const data = DownloadStartSchema.parse(request.body);

			const [videoIds, runningJobs] = await Promise.all([
				db.query.videos.findMany({
					where: (video, { and, eq, or, inArray }) => {
						const whereArgs: (SQLWrapper | undefined)[] = [
							eq(video.downloadStatus, 'pending'), //
							or(eq(video.status, 'none'), eq(video.status, 'past'))
						];

						if (data.videoIds && data.videoIds.length > 0) {
							whereArgs.push(inArray(video.id, data.videoIds));
						}

						return and(...whereArgs);
					},
					columns: { id: true, channelId: true, status: true }
				}),
				downloader.getJobs(['active', 'waiting'])
			]);

			const runningJobsIds = runningJobs.map((job) => job.data.videoId);
			const newVideoIds = videoIds.filter((video) => !runningJobsIds.includes(video.id));
			const groupedVideos = Object.groupBy(newVideoIds, (video) => video.channelId);

			const videosArr: { videoId: string; channelId: string }[] = [];

			if (videosArr.length === 0) {
				server.log.debug('No new videos to download');
			}

			for (const [channelId, videos] of Object.entries(groupedVideos)) {
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
				await downloader.add(
					`video/${video.videoId}`,
					{
						type: 'video',
						videoId: video.videoId,
						channelId: video.channelId,
						live: false
					},
					{ priority: 2 }
				);
			}

			await reply.send();
		}
	);

	server.post(
		'/stop', //
		{ schema: { tags: ['Downloads'] } },
		async (_, reply): Promise<void> => {
			await downloader.obliterate({
				force: true
			});

			const controllers = downloadControllers.values();
			for (const controller of controllers) {
				controller.abort();
			}

			server.websocketServer.emit('status', {
				type: StatusEvent.DownloadCancelled
			});

			await reply.status(201).send();
		}
	);

	server.post(
		'/scan', //
		{ schema: { tags: ['Downloads'] } },
		async (_, reply): Promise<void> => {
			if (scansInProgress.scan) {
				return await reply.status(409).send();
			}

			const channels = await db.query.channels.findMany({
				columns: { id: true }
			});

			for (const [index, channel] of channels.entries()) {
				await scanner.add(`channel/${channel.id}/scan`, {
					type: 'scan',
					channelId: channel.id,
					position: index,
					total: channels.length
				});
			}

			await reply.status(201).send();
		}
	);

	done();
};
