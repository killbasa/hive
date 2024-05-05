import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { tokenHandler } from '../auth/tokens.js';

export const notificationRoutes: FastifyPluginAsyncTypebox = async (server) => {
	server.addHook('onRequest', tokenHandler);

	server.get(
		'', //
		{
			websocket: true,
			schema: {
				description: 'Websocket for server notifications',
				tags: ['Websockets'],
			},
		},
		(socket) => {
			const handleNotif = (data: { status: 'end' | 'start'; videoId: string; title: string }): void => {
				socket.send(JSON.stringify(data));
			};

			server.notifications.on('livestream', handleNotif);

			socket.on('close', () => {
				server.notifications.off('livestream', handleNotif);
			});

			socket.send('Connected');
		},
	);
};
