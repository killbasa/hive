import { notificationRoutes } from './routes/notifications';
import { pubsubRoutes } from './routes/pubsub';
import { videoRoutes } from './routes/videos';
import { channelRoutes } from './routes/channels';
import { rootRoutes } from './routes/root';
import { referenceRoutes } from './routes/reference';
import { authRoutes } from './routes/auth';
import type { FastifyPluginCallback } from 'fastify';

export const routes: FastifyPluginCallback = async (server) => {
	await server.register(rootRoutes);
	await server.register(referenceRoutes);

	await server.register(channelRoutes, { prefix: 'channels' });
	await server.register(videoRoutes, { prefix: 'videos' });
	await server.register(notificationRoutes, { prefix: 'notifications' });
	await server.register(pubsubRoutes, { prefix: 'pubsub' });
	await server.register(authRoutes, { prefix: 'auth' });
};
