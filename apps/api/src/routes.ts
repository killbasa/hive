import type { FastifyPluginAsync } from 'fastify';
import { authRoutes } from './plugins/auth/routes.js';
import { channelRoutes } from './plugins/channels/routes.js';
import { coreRoutes } from './plugins/core/routes.js';
import { downloadsRoutes } from './plugins/downloads/routes.js';
import { notificationRoutes } from './plugins/notifications/routes.js';
import { referenceRoutes } from './plugins/openapi/routes.js';
import { settingsRoutes } from './plugins/settings/routes.js';
import { userRoutes } from './plugins/users/routes.js';
import { videoRoutes } from './plugins/videos/routes.js';

export const routes: FastifyPluginAsync = async (server) => {
	await server.register(coreRoutes);
	await server.register(referenceRoutes);
	await server.register(authRoutes, { prefix: 'auth' });
	await server.register(userRoutes, { prefix: 'users' });

	await server.register(settingsRoutes, { prefix: 'settings' });
	await server.register(channelRoutes, { prefix: 'channels' });
	await server.register(videoRoutes, { prefix: 'videos' });
	await server.register(downloadsRoutes, { prefix: 'downloads' });
	await server.register(notificationRoutes, { prefix: 'notifications' });

	server.log.info('routes loaded');
};
