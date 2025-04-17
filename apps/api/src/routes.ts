import { authRoutes } from './plugins/auth/routes.js';
import { channelRoutes } from './plugins/channels/routes.js';
import { coreRoutes } from './plugins/core/routes.js';
import { downloadsRoutes } from './plugins/downloads/routes.js';
import { notificationRoutes } from './plugins/notifications/routes.js';
import { referenceRoutes } from './plugins/openapi/routes.js';
import { settingsRoutes } from './plugins/settings/routes.js';
import { userRoutes } from './plugins/users/routes.js';
import { videoRoutes } from './plugins/videos/routes.js';
import type { FastifyPluginAsync } from 'fastify';

export const routes: FastifyPluginAsync = async (server) => {
	await server.routes(coreRoutes);
	await server.routes(referenceRoutes, { prefix: 'reference' });
	await server.routes(authRoutes, { prefix: 'auth' });
	await server.routes(userRoutes, { prefix: 'users' });

	await server.routes(settingsRoutes, { prefix: 'settings' });
	await server.routes(channelRoutes, { prefix: 'channels' });
	await server.routes(videoRoutes, { prefix: 'videos' });
	await server.routes(downloadsRoutes, { prefix: 'downloads' });
	await server.routes(notificationRoutes, { prefix: 'notifications' });

	server.log.info('routes loaded');
};
