import FastifySwagger from '@fastify/swagger';
import FastifyHelmet from '@fastify/helmet';
import FastifyWebsocket from '@fastify/websocket';
import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';

export async function app(): Promise<FastifyInstance> {
	const server = Fastify({
		logger: {
			transport: {
				target: 'pino-pretty',
				options: {
					translateTime: 'HH:MM:ss Z',
					ignore: 'pid,hostname'
				}
			}
		}
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

	await server.register(FastifyHelmet);
	await server.register(FastifyWebsocket);

	return await server;
}
