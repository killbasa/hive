import { isDev } from './lib/constants';
import FastifySwagger from '@fastify/swagger';
import FastifyHelmet from '@fastify/helmet';
import FastifyCors from '@fastify/cors';
import FastifyCompress from '@fastify/compress';
import FastifyStatic from '@fastify/static';
import FastifyWebsocket from '@fastify/websocket';
import FastifyRateLimit from '@fastify/rate-limit';
import Fastify from 'fastify';
import { resolve } from 'node:path';
import type { FastifyInstance, FastifyServerOptions } from 'fastify';

export async function app(): Promise<FastifyInstance> {
	const server = Fastify({
		logger: getLogger()
	});

	await server.register(FastifySwagger, {
		mode: 'dynamic',
		openapi: {
			info: {
				title: 'Hive',
				version: '0.0.1'
			}
		}
	});

	await server.register(FastifyCors, {
		maxAge: 600,
		origin: '*',
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
