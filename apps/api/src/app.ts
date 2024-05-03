import { isDev } from './lib/constants.js';
import { RedisConnectionOptions, config } from './lib/config.js';
import { HiveSettings } from './plugins/settings/service.js';
import { HiveNotifier } from './plugins/notifications/emitter.js';
import FastifySwagger from '@fastify/swagger';
import FastifyCookie from '@fastify/cookie';
import FastifyJwt from '@fastify/jwt';
import FastifyHelmet from '@fastify/helmet';
import FastifyCors from '@fastify/cors';
import FastifyRateLimit from '@fastify/rate-limit';
import FastifyWebsocket from '@fastify/websocket';
import Fastify from 'fastify';
import { Queue } from 'bullmq';
import { TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { QueueOptions } from 'bullmq';
import type { FastifyInstance, FastifyServerOptions } from 'fastify';

export async function app(): Promise<FastifyInstance> {
	const server = Fastify({
		logger: getLogger()
	})
		.withTypeProvider<TypeBoxTypeProvider>()
		.setValidatorCompiler(TypeBoxValidatorCompiler);

	/**
	 * Plugins
	 */
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

	await server.register(FastifyRateLimit, {
		max: 1000,
		timeWindow: 60_000
	});

	await server.register(FastifyHelmet, {
		crossOriginResourcePolicy: { policy: 'same-site' }
	});
	await server.register(FastifyWebsocket);

	return decorate(server);
}

export function decorate(instance: FastifyInstance): FastifyInstance {
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

	instance.decorate('settings', new HiveSettings());
	instance.decorate('notifications', new HiveNotifier());

	return instance;
}

function getLogger(): FastifyServerOptions['logger'] {
	if (!isDev) {
		return {
			level: 'info'
		};
	}

	return {
		level: 'debug',
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname'
			}
		}
	};
}
