import type { FastifyPluginCallback } from 'fastify';

export const statusRoutes: FastifyPluginCallback = (server, _, done) => {
	server.get(
		'/', //
		{ websocket: true, schema: { tags: ['Websockets'] } },
		(socket) => {
			const handleMessage = (message: string): void => {
				socket.send(JSON.stringify(message));
			};

			server.websocketServer.on('status', handleMessage);

			socket.on('close', () => {
				server.websocketServer.off('status', handleMessage);
			});

			socket.send('Connected');
		}
	);

	server.post(
		'/', //
		{ schema: { tags: ['Websockets'] } },
		() => {
			server.websocketServer.emit('status', {
				status: 'error',
				id: 'asd',
				percentage: 'asd',
				total: 'asd',
				speed: 'asd',
				eta: 'asd'
			});
		}
	);

	done();
};
