import { checkToken } from '../../auth/tokens';
import type { FastifyPluginCallback } from 'fastify';

export const notificationRoutes: FastifyPluginCallback = (server, _, done) => {
	server.addHook('onRequest', checkToken);

	server.get(
		'/', //
		{ websocket: true, schema: { tags: ['Websockets'] } },
		(socket) => {
			const handleNotif = (data: { status: 'end' | 'start'; videoId: string; title: string }): void => {
				socket.send(JSON.stringify(data));
			};

			server.websocketServer.on('livestream', handleNotif);

			socket.on('close', () => {
				server.websocketServer.off('livestream', handleNotif);
			});

			socket.send('Connected');
		}
	);

	done();
};
