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
import FastifyCompress from '@fastify/compress';
import FastifyStatic from '@fastify/static';
import FastifyWebsocket from '@fastify/websocket';
import Fastify from 'fastify';
import { Queue } from 'bullmq';
import { resolve } from 'node:path';
import type { QueueOptions } from 'bullmq';
import type { FastifyInstance, FastifyServerOptions } from 'fastify';

export async function app(): Promise<FastifyInstance> {
	const server = Fastify({
		logger: getLogger()
	});

	/**
	 * Plugins
	 */
	await server.register(FastifySwagger, {
		mode: 'dynamic',
		openapi: {
			info: {
				title: 'Hive',
				version: '0.0.1'
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

	// Register compression before static
	await server.register(FastifyCompress);
	await server.register(FastifyStatic, {
		prefix: '/assets',
		root: resolve('data/media')
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
			level: 'warn'
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
