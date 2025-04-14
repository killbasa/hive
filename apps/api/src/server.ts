import { isDev, isTesting } from './lib/constants.js';
import { HiveMetrics } from './lib/otel/MetricsClient.js';
import { authHandler } from './plugins/auth/handler.js';
import { HiveNotifier } from './plugins/notifications/emitter.js';
import { HiveSettings } from './plugins/settings/service.js';
import { loadConfig } from './lib/config.js';
import FastifyCookie from '@fastify/cookie';
import FastifyCors from '@fastify/cors';
import FastifyHelmet from '@fastify/helmet';
import FastifyJwt from '@fastify/jwt';
import FastifySwagger from '@fastify/swagger';
import { TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox';
import FastifyWebsocket from '@fastify/websocket';
import { Queue } from 'bullmq';
import Fastify from 'fastify';
import type { QueueOptions } from 'bullmq';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { FastifyInstance, LogLevel } from 'fastify';

export async function buildServer(): Promise<FastifyInstance> {
	let level: LogLevel;
	if (isTesting) {
		level = 'warn';
	} else if (isDev) {
		level = 'debug';
	} else {
		level = 'info';
	}

	const server = Fastify({
		disableRequestLogging: !isDev,
		logger: {
			level,
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

	const config = loadConfig();
	server.decorate('config', config);

	/**
	 * Plugins
	 */
	await registerSwagger(server);

	await server.register(FastifyCookie);
	await server.register(FastifyJwt, {
		secret: config.AUTH_SECRET,
		cookie: {
			cookieName: config.COOKIE_NAME,
			signed: false,
		},
	});

	await server.register(FastifyCors, {
		origin: config.AUTH_ORIGIN,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	});

	await server.register(FastifyHelmet, {
		crossOriginResourcePolicy: {
			policy: 'same-site',
		},
	});
	await server.register(FastifyWebsocket);

	return server;
}

export function decorate(server: FastifyInstance): void {
	server.decorate('settings', new HiveSettings());
	server.decorate('notifications', new HiveNotifier());

	if (server.config.METRICS_ENABLED) {
		server.decorate('metrics', new HiveMetrics());
	}

	const options: QueueOptions = {
		connection: {
			host: server.config.REDIS_HOST,
			port: server.config.REDIS_PORT,
			password: server.config.REDIS_PASSWORD,
		},
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
}

export async function registerSwagger(server: FastifyInstance): Promise<void> {
	server.decorate('routes', async (routes, options = {}) => {
		if (routes.subroutes) {
			for (const [prefix, route] of Object.entries(routes.subroutes)) {
				await server.routes(route, {
					prefix: options.prefix ? `${options.prefix}/${prefix}` : prefix,
				});
			}
		}

		if (routes.public) {
			await server.register(routes.public, options);
		}

		if (routes.authenticated) {
			await server.register((instance, opts, done) => {
				instance.addHook('onRequest', authHandler);
				routes.authenticated?.(instance, opts, done);
			}, options);
		}
	});

	await server.register(FastifySwagger, {
		mode: 'dynamic',
		openapi: {
			openapi: '3.1.0',
			info: {
				title: 'Hive',
				version: server.config.VERSION,
				description: 'Hive API',
			},
			tags: [
				{ name: 'Core', description: 'End-points related to the server itself' },
				{ name: 'OpenAPI', description: 'OpenAPI related endpoints' },
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
						name: 'x-api-key',
					},
				},
			},
		},
	});
}

export const server = await buildServer();
