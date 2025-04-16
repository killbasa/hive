import { MessageResponse } from '../../lib/responses.js';
import { getYtdlpVersion } from '../../lib/ytdlp/constants.js';
import { HiveMetrics } from '../../lib/otel/MetricsClient.js';
import { isDev } from '../../lib/constants.js';
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
					.header('Content-Type', HiveMetrics.contentType)
					.send(metrics);
			},
		);

		if (isDev) {
			server.post(
				'/csp', //
				{ schema: { hide: true } },
				async (request, reply): Promise<void> => {
					server.log.info(request.body);

					await reply.status(200).send();
				},
			);
		}

		server.get(
			'/favicon.ico', //
			{ schema: { hide: true } },
			async (_, reply): Promise<void> => {
				await reply.code(404).send();
			},
		);

		server.get(
			'/site.webmanifest', //
			{ schema: { hide: true } },
			async (_, reply): Promise<void> => {
				await reply.redirect('/ui/site.webmanifest');
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
					security: [{ apikey: ['x-api-key'] }],
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
					api: server.config.server.version,
					ytdlp: ytdlpVersion,
				});
			},
		);

		done();
	},
};
