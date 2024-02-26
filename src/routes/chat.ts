import type { FastifyPluginCallback } from 'fastify';

export const chat: FastifyPluginCallback = (server, _, done) => {
	server.get('/', { websocket: true }, ({ socket }) => {
		socket.on('message', (message: unknown) => {
			server.log.info(`message from user: ${message}`);
			socket.send('hi from server');
		});
	});

	done();
};
