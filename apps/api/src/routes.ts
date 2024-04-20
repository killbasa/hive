import { rootRoutes } from './plugins/core/routes.js';
import { referenceRoutes } from './plugins/openapi/routes.js';
import { credentialAuthRoutes } from './plugins/auth/credentials/routes.js';
import { settingsRoutes } from './plugins/settings/routes.js';
import { channelRoutes } from './plugins/channels/routes.js';
import { videoRoutes } from './plugins/videos/routes.js';
import { downloadsRoutes } from './plugins/downloads/routes/downloads.js';
import { notificationRoutes } from './plugins/notifications/routes.js';
import { userRoutes } from './plugins/users/routes.js';
import type { FastifyPluginCallback } from 'fastify';

export const routes: FastifyPluginCallback = async (server) => {
	await server.register(rootRoutes);
	await server.register(credentialAuthRoutes, { prefix: 'auth' });
	await server.register(userRoutes, { prefix: 'users' });

	await server.register(referenceRoutes);
	await server.register(settingsRoutes, { prefix: 'settings' });
	await server.register(channelRoutes, { prefix: 'channels' });
	await server.register(videoRoutes, { prefix: 'videos' });
	await server.register(downloadsRoutes, { prefix: 'downloads' });
	await server.register(notificationRoutes, { prefix: 'notifications' });
};
