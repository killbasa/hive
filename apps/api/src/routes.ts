import { rootRoutes } from './routes/root';
import { referenceRoutes } from './routes/reference';
import { channelRoutes } from './routes/channels';
import { videoRoutes } from './routes/videos';
import { downloadsRoutes } from './routes/downloads';
import { notificationRoutes } from './routes/notifications';
import { statusRoutes } from './routes/status';
import type { FastifyPluginCallback } from 'fastify';

export const routes: FastifyPluginCallback = async (server) => {
	await server.register(rootRoutes);
	await server.register(referenceRoutes);

	await server.register(channelRoutes, { prefix: 'channels' });
	await server.register(videoRoutes, { prefix: 'videos' });
	await server.register(downloadsRoutes, { prefix: 'downloads' });
	await server.register(notificationRoutes, { prefix: 'notifications' });
	await server.register(statusRoutes, { prefix: 'status' });
};