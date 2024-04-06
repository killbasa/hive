import { isDev } from './lib/constants';
import { config } from './lib/config';
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
import { resolve } from 'node:path';
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

	return await server;
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
