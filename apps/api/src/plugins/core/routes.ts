import { config } from '../../lib/config.js';
import { MessageResponse } from '../../lib/responses.js';
import { getYtdlpVersion } from '../../lib/ytdlp/constants.js';
import { Type } from '@fastify/type-provider-typebox';
import type { HiveRoutes } from '../../lib/types/hive.js';

export const coreRoutes: HiveRoutes = {
	public: (server, _, done) => {
		server.get(
			'/heartbeat',
			{
				schema: {
					description: 'Check if the server is running',
					tags: ['Core'],
					response: {
						200: Type.Object({
							message: Type.Literal('OK'),
						}),
					},
				},
			},
			async (_, reply): Promise<void> => {
				await reply.status(200).send({
					message: 'OK',
				});
			},
		);

		server.get(
			'/metrics',
			{
				schema: {
					description: 'Get Prometheus metrics for the server',
					tags: ['Core'],
					response: {
						200: Type.String({ description: 'Prometheus metrics' }),
						501: MessageResponse('Metrics are not enabled for the instance'),
					},
				},
			},
			async (_, reply): Promise<void> => {
				if (server.metrics === undefined) {
					await reply.status(501).send({
						message: 'Metrics are not enabled for the instance',
					});
					return;
				}

				const metrics = await server.metrics.collect();

				await reply //
					.status(200)
					.header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
					.send(metrics);
			},
		);

		server.get(
			'/favicon.ico', //
			{ schema: { hide: true } },
			async (_, reply): Promise<void> => {
				await reply.code(404).send();
			},
		);

		done();
	},
	authenticated: (server, _, done) => {
		const ytdlpVersion = getYtdlpVersion();
		server.get(
			'/version',
			{
				schema: {
					description: 'Get the version numbers for Hive',
					tags: ['Core'],
					response: {
						200: Type.Object({
							api: Type.String(),
							ytdlp: Type.String(),
						}),
					},
				},
			},
			async (_, reply): Promise<void> => {
				await reply.status(200).send({
					api: config.VERSION,
					ytdlp: ytdlpVersion,
				});
			},
		);

		done();
	},
};
