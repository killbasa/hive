import { RedisConnectionOptions, config } from './lib/config.js';
import { HiveSettings } from './plugins/settings/service.js';
import { HiveNotifier } from './plugins/notifications/emitter.js';
import { HiveMetrics } from './lib/otel/MetricsClient.js';
import { isDev } from './lib/constants.js';
import FastifySwagger from '@fastify/swagger';
import FastifyCookie from '@fastify/cookie';
import FastifyJwt from '@fastify/jwt';
import FastifyHelmet from '@fastify/helmet';
import FastifyCors from '@fastify/cors';
import FastifyWebsocket from '@fastify/websocket';
import Fastify from 'fastify';
import { Queue } from 'bullmq';
import { TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox';
import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { QueueOptions } from 'bullmq';

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
					ignore: 'pid,hostname'
				}
			}
		}
	})
		.withTypeProvider<TypeBoxTypeProvider>()
		.setValidatorCompiler(TypeBoxValidatorCompiler);

	await server.register(FastifySwagger, {
		mode: 'dynamic',
		openapi: {
			openapi: '3.1.0',
			info: {
				title: 'Hive',
				version: process.env.npm_package_version!
			}
		}
	});

	await server.register(FastifyCookie);
	await server.register(FastifyJwt, {
		secret: config.AUTH_SECRET,
		cookie: {
			cookieName: config.AUTH_COOKIE_NAME,
			signed: false
		}
	});

	await server.register(FastifyCors, {
		origin: config.AUTH_ORIGIN,
		credentials: true
	});

	await server.register(FastifyHelmet, {
		crossOriginResourcePolicy: {
			policy: 'same-site'
		}
	});
	await server.register(FastifyWebsocket);

	return decorate(server);
}

export function decorate(instance: FastifyInstance): FastifyInstance {
	instance.decorate('settings', new HiveSettings());
	instance.decorate('notifications', new HiveNotifier());

	if (config.METRICS_ENABLED) {
		instance.decorate('metrics', new HiveMetrics());
	}

	const options: QueueOptions = {
		connection: RedisConnectionOptions,
		defaultJobOptions: {
			removeOnComplete: true,
			removeOnFail: true
		}
	};

	instance.decorate('tasks', {
		internal: new Queue('internal', options),
		downloader: new Queue('downloader', options),
		scanner: new Queue('scanner', options)
	});

	return instance;
}
