import type { HiveRoutes } from '../../lib/types/hive.js';

export const notificationRoutes: HiveRoutes = {
	authenticated: (server, _, done) => {
		server.get(
			'/', //
			{
				websocket: true,
				schema: {
					description: 'Websocket for server notifications',
					tags: ['Websockets'],
					security: [{ apikey: ['x-api-key'] }],
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

		done();
	},
};
