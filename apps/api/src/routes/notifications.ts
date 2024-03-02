import { notifications } from '../jobs/queues';
import type { FastifyPluginCallback } from 'fastify';

export const notificationRoutes: FastifyPluginCallback = (server, _, done) => {
	server.get(
		'/', //
		{ websocket: true, schema: { tags: ['Websockets'] } },
		({ socket }) => {
			socket.on('message', async (data: Buffer) => {
				const message: { type: string; data: string } = JSON.parse(data.toString());

				switch (message.type) {
					case 'ping':
						socket.send(JSON.stringify({ type: 'pong' }));
						await notifications.add('notifications', { message: 'ping' });
						break;
					case 'join':
						socket.send(`Joined room (${message.data})`);
						break;
					case 'leave':
						socket.send(`Left room (${message.data})`);
						break;
					default:
						socket.send('Unknown message');
				}
			});
		}
	);

	done();
};
