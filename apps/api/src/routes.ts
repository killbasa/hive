import { rootRoutes } from './plugins/core/routes';
import { referenceRoutes } from './plugins/openapi/routes';
import { authRoutes } from './plugins/auth/credentials/routes';
import { settingsRoutes } from './plugins/settings/routes';
import { channelRoutes } from './plugins/channels/routes';
import { videoRoutes } from './plugins/videos/routes/videos';
import { downloadsRoutes } from './plugins/downloads/routes/downloads';
import { notificationRoutes } from './plugins/videos/routes/notifications';
import { userRoutes } from './plugins/users/routes';
import type { FastifyPluginCallback } from 'fastify';

export const routes: FastifyPluginCallback = async (server) => {
	await server.register(rootRoutes);
	await server.register(authRoutes, { prefix: 'auth' });
	await server.register(userRoutes, { prefix: 'users' });

	await server.register(referenceRoutes);
	await server.register(settingsRoutes, { prefix: 'settings' });
	await server.register(channelRoutes, { prefix: 'channels' });
	await server.register(videoRoutes, { prefix: 'videos' });
	await server.register(downloadsRoutes, { prefix: 'downloads' });
	await server.register(notificationRoutes, { prefix: 'notifications' });
};
