import { DownloadStartSchema } from '../schemas.js';
import { db } from '../../../db/client.js';
import { tokenHandler } from '../../auth/tokens.js';
import { downloadControllers } from '../../tasks/handlers/downloader.js';
import { scansInProgress } from '../../tasks/handlers/scanner.js';
import { StatusEvent } from '@hive/common';
import type { DownloadStatus } from '@hive/common';
import type { FastifyPluginCallback } from 'fastify';
import type { SQLWrapper } from 'drizzle-orm';

export const downloadsRoutes: FastifyPluginCallback = (server, _, done) => {
	server.addHook('onRequest', tokenHandler);

	server.get(
		'/queue', //
		{ schema: { tags: ['Downloads'] } },
		async (_, reply): Promise<void> => {
			const tasks = await server.tasks.downloader.getJobs('waiting');

			await reply.send({
				queue: tasks.map((task) => task.data)
			});
		}
	);

	server.get(
		'/current', //
		{ schema: { tags: ['Downloads'] } },
		async (_, reply): Promise<void> => {
			const task = await server.tasks.downloader.getActive(0, 1);
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

						if (data.videoIds.length > 0) {
							whereArgs.push(inArray(video.id, data.videoIds));
						}

						return and(...whereArgs);
					},
					columns: { id: true, channelId: true, status: true }
				}),
				server.tasks.downloader.getJobs(['active', 'waiting'])
			]);

			const runningJobsIds = runningJobs.map((job) => job.data.videoId);
			const newVideoIds = videoIds.filter((video) => !runningJobsIds.includes(video.id));
			const groupedVideos = Object.groupBy(newVideoIds, (video) => video.channelId);

			const videosArr: { videoId: string; channelId: string }[] = [];

			if (videosArr.length === 0) {
				server.log.debug('no new videos to download');
			}

			for (const [channelId, videos] of Object.entries(groupedVideos)) {
				if (videos === undefined) continue;

				for (const video of videos) {
					if (video.status === 'live') {
						await server.tasks.downloader.add(
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
				await server.tasks.downloader.add(
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
			await server.tasks.downloader.obliterate({
				force: true
			});

			const controllers = downloadControllers.values();
			for (const controller of controllers) {
				controller.abort();
			}

			server.notifications.emit('status', {
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
				await server.tasks.scanner.add(`channel/${channel.id}/scan`, {
					type: 'scan',
					channelId: channel.id,
					position: index,
					total: channels.length
				});
			}

			await reply.status(201).send();
		}
	);

	server.get(
		'/status', //
		{ websocket: true, schema: { tags: ['Websockets'] } },
		(socket) => {
			const handleMessage = (message: DownloadStatus): void => {
				socket.send(JSON.stringify(message));
			};

			server.notifications.on('status', handleMessage);

			socket.on('close', () => {
				server.notifications.off('status', handleMessage);
			});
		}
	);

	done();
};
