import FastifyCookie from '@fastify/cookie';
import FastifyCors from '@fastify/cors';
import FastifyHelmet from '@fastify/helmet';
import FastifyJwt from '@fastify/jwt';
import FastifySwagger from '@fastify/swagger';
import { TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import FastifyWebsocket from '@fastify/websocket';
import { Queue } from 'bullmq';
import type { QueueOptions } from 'bullmq';
import Fastify from 'fastify';
import type { FastifyInstance, RegisterOptions } from 'fastify';
import { RedisConnectionOptions, config } from './lib/config.js';
import { isDev } from './lib/constants.js';
import { HiveMetrics } from './lib/otel/MetricsClient.js';
import type { HiveRoutes } from './lib/types/hive.js';
import { tokenHandler } from './plugins/auth/tokens.js';
import { HiveNotifier } from './plugins/notifications/emitter.js';
import { HiveSettings } from './plugins/settings/service.js';

export const LogLevel = isDev ? 'debug' : 'info';

export async function app(): Promise<FastifyInstance> {
	const server = Fastify({
		logger: {
			level: LogLevel,
			transport: {
				target: 'pino-pretty',
				options: {
					colorize: isDev,
					translateTime: 'HH:MM:ss Z',
					ignore: 'pid,hostname',
				},
			},
		},
	})
		.withTypeProvider<TypeBoxTypeProvider>()
		.setValidatorCompiler(TypeBoxValidatorCompiler);

	await server.register(FastifySwagger, {
		mode: 'dynamic',
		openapi: {
			openapi: '3.1.0',
			info: {
				title: 'Hive',
				version: config.VERSION,
				description: 'Hive API',
			},
			tags: [
				{ name: 'Core', description: 'End-points related to the server itself' },
				{ name: 'Open API', description: 'Open API related endpoints' },
				{ name: 'Auth', description: 'Authentication related end-points' },
				{ name: 'Users', description: 'User related end-points' },
				{ name: 'Settings', description: 'Settings related end-points' },
				{ name: 'Channels', description: 'Channel related end-points' },
				{ name: 'Videos', description: 'Video related end-points' },
				{ name: 'Downloads', description: 'Download related end-points' },
				{ name: 'Websockets', description: 'Websocket related end-points' },
			],
			components: {
				securitySchemes: {
					apikey: {
						type: 'apiKey',
						in: 'header',
						name: 'X-Api-Key',
					},
				},
			},
		},
	});

	await server.register(FastifyCookie);
	await server.register(FastifyJwt, {
		secret: config.AUTH_SECRET,
		cookie: {
			cookieName: config.AUTH_COOKIE_NAME,
			signed: false,
		},
	});

	await server.register(FastifyCors, {
		origin: config.AUTH_ORIGIN,
		credentials: true,
	});

	await server.register(FastifyHelmet, {
		crossOriginResourcePolicy: {
			policy: 'same-site',
		},
	});
	await server.register(FastifyWebsocket);

	return decorate(server);
}

export function decorate(server: FastifyInstance): FastifyInstance {
	server.decorate('registerRoutes', async (routes: HiveRoutes, options?: RegisterOptions) => {
		if (routes.subroutes) {
			for (const [prefix, route] of Object.entries(routes.subroutes)) {
				await server.registerRoutes(route, { prefix });
			}
		}

		if (routes.public) {
			await server.register(routes.public, options);
		}

		if (routes.authenticated) {
			await server.register((instance, opts, done) => {
				instance.addHook('onRequest', tokenHandler);
				routes.authenticated?.(instance, opts, done);
			}, options);
		}
	});

	server.decorate('settings', new HiveSettings());
	server.decorate('notifications', new HiveNotifier());

	if (config.METRICS_ENABLED) {
		server.decorate('metrics', new HiveMetrics());
	}

	const options: QueueOptions = {
		connection: RedisConnectionOptions,
		defaultJobOptions: {
			removeOnComplete: true,
			removeOnFail: true,
		},
	};

	server.decorate('tasks', {
		internal: new Queue('internal', options),
		downloader: new Queue('downloader', options),
		scanner: new Queue('scanner', options),
	});

	return server;
}
