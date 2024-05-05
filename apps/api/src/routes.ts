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
	await server.registerRoutes(coreRoutes);
	await server.registerRoutes(referenceRoutes);
	await server.registerRoutes(authRoutes, { prefix: 'auth' });
	await server.registerRoutes(userRoutes, { prefix: 'users' });

	await server.registerRoutes(settingsRoutes, { prefix: 'settings' });
	await server.registerRoutes(channelRoutes, { prefix: 'channels' });
	await server.registerRoutes(videoRoutes, { prefix: 'videos' });
	await server.registerRoutes(downloadsRoutes, { prefix: 'downloads' });
	await server.registerRoutes(notificationRoutes, { prefix: 'notifications' });

	server.log.info('routes loaded');
};
