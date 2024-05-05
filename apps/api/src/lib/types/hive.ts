import type { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';

export type HiveRoutes = {
	subroutes?: Record<string, HiveRoutes>;
	public?: FastifyPluginCallbackTypebox;
	authenticated?: FastifyPluginCallbackTypebox;
};
