import { checkToken } from '../lib/auth';
import type { FastifyPluginCallback } from 'fastify';

export const statusRoutes: FastifyPluginCallback = (server, _, done) => {
	server.addHook('onRequest', checkToken);

	server.get(
		'/downloads', //
		{ websocket: true, schema: { tags: ['Websockets'] } },
		(socket) => {
			const handleMessage = (message: string): void => {
				socket.send(JSON.stringify(message));
			};

			server.websocketServer.on('status', handleMessage);

			socket.on('close', () => {
				server.websocketServer.off('status', handleMessage);
			});
		}
	);

	done();
};
