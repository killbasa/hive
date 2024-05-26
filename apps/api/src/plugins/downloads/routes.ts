import { DownloadStartBody } from './body.js';
import { EmptyResponse } from '../../lib/responses.js';
import { downloadPendingVideos } from '../../tasks/handlers/downloadPending.js';
import { downloadControllers } from '../../tasks/handlers/downloader.js';
import { StatusEvent } from '@hive/common';
import type { DownloadStatus } from '@hive/common';
import type { HiveRoutes } from '../../lib/types/hive.js';

export const downloadsRoutes: HiveRoutes = {
	authenticated: (server, _, done) => {
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
			async (request, reply): Promise<void> => {
				const { body } = request;

				await downloadPendingVideos({ videoIds: body.videoIds });

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

		server.get(
			'/stats', //
			{
				schema: {
					tags: ['Downloads'],
				},
			},
			() => {
				return {
					rate: '',
					queue: 0,
					timeLeft: 0,
				};
			},
		);

		done();
	},
};
