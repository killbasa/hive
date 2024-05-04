import { tokenHandler } from '../auth/tokens.js';
import type { FastifyPluginAsync } from 'fastify';

export const notificationRoutes: FastifyPluginAsync = async (server) => {
	server.addHook('onRequest', tokenHandler);

	server.get(
		'', //
		{ websocket: true, schema: { tags: ['Websockets'] } },
		(socket) => {
			const handleNotif = (data: { status: 'end' | 'start'; videoId: string; title: string }): void => {
				socket.send(JSON.stringify(data));
			};

			server.notifications.on('livestream', handleNotif);

			socket.on('close', () => {
				server.notifications.off('livestream', handleNotif);
			});

			socket.send('Connected');
		}
	);
};
