import { StatusEvent } from '@hive/common';
import type { DownloadStatus } from '@hive/common';
import type { SQLWrapper } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { EmptyResponse } from '../../lib/responses.js';
import type { HiveRoutes } from '../../lib/types/hive.js';
import { downloadControllers } from '../tasks/handlers/downloader.js';
import { scansInProgress } from '../tasks/handlers/scanner.js';
import { DownloadStartBody } from './body.js';
import { DownloadCurrentSchema } from './schema.js';
import { scanAllChannels } from './utils.js';

export const downloadsRoutes: HiveRoutes = {
	authenticated: (server, _, done) => {
		server.get(
			'/current', //
			{
				schema: {
					description: 'Get the current download',
					tags: ['Downloads'],
					response: {
						200: DownloadCurrentSchema,
					},
				},
			},
			async (_, reply): Promise<void> => {
				const task = await server.tasks.downloader.getActive(0, 1);
				if (task.length === 0) {
					return await reply.status(200).send({
						current: undefined,
					});
				}

				const video = await db.query.videos.findFirst({
					where: (video, { eq }) => eq(video.id, task[0].data.videoId),
					columns: {
						id: true,
						channelId: true,
						title: true,
					},
				});

				await reply.status(200).send({
					current: video,
				});
			},
		);

		server.post(
			'/start', //
			{
				schema: {
					description: 'Start downloading the currently pending videos',
					tags: ['Downloads'],
					body: DownloadStartBody,
					response: {
						200: EmptyResponse('Download started successfully'),
					},
				},
			},
			// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
			async (request, reply): Promise<void> => {
				const { body } = request;

				const [videoIds, runningJobs] = await Promise.all([
					db.query.videos.findMany({
						where: (video, { and, eq, or, inArray }) => {
							const whereArgs: (SQLWrapper | undefined)[] = [
								eq(video.downloadStatus, 'pending'), //
								or(eq(video.status, 'none'), eq(video.status, 'past')),
							];

							if (body.videoIds.length > 0) {
								whereArgs.push(inArray(video.id, body.videoIds));
							}

							return and(...whereArgs);
						},
						columns: { id: true, channelId: true, status: true },
					}),
					server.tasks.downloader.getJobs(['active', 'waiting']),
				]);

				const runningJobsIds = runningJobs.map((job) => job.data.videoId);
				const newVideoIds = videoIds.filter((video) => !runningJobsIds.includes(video.id));
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
								{ priority: 1 },
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
						{ priority: 2 },
					);
				}

				await reply.status(200).send();
			},
		);

		server.post(
			'/stop', //
			{
				schema: {
					description: 'Stop all downloads',
					tags: ['Downloads'],
					response: {
						201: EmptyResponse('Downloads stopped successfully'),
					},
				},
			},
			async (_, reply): Promise<void> => {
				await server.tasks.downloader.obliterate({
					force: true,
				});

				const controllers = downloadControllers.values();
				for (const controller of controllers) {
					controller.abort();
				}

				server.notifications.emit('status', {
					type: StatusEvent.DownloadCancelled,
				});

				await reply.status(201).send();
			},
		);

		server.post(
			'/scan', //
			{
				schema: {
					description: 'Scan all channels for new videos',
					tags: ['Downloads'],
					response: {
						201: EmptyResponse('Scan started successfully'),
						409: EmptyResponse('Scan already in progress'),
					},
				},
			},
			async (_, reply): Promise<void> => {
				if (scansInProgress.scan) {
					return await reply.status(409).send();
				}

				await scanAllChannels();

				await reply.status(201).send();
			},
		);

		server.get(
			'/status', //
			{
				websocket: true,
				schema: {
					description: 'Websocket for download updates',
					tags: ['Websockets'],
				},
			},
			(socket) => {
				const handleMessage = (message: DownloadStatus): void => {
					socket.send(JSON.stringify(message));
				};

				server.notifications.on('status', handleMessage);

				socket.on('close', () => {
					server.notifications.off('status', handleMessage);
				});
			},
		);

		done();
	},
};
