import { type FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { config } from '../../lib/config.js';
import { EmptyResponse, MessageResponse } from '../../lib/responses.js';
import { getYtdlpVersion } from '../../lib/ytdlp/constants.js';
import { tokenHandler } from '../auth/tokens.js';

export const coreRoutes: FastifyPluginAsyncTypebox = async (server) => {
	await server.register(async (instance) => {
		instance.get(
			'/heartbeat', //
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

		instance.get(
			'/metrics', //
			{
				schema: {
					description: 'Get Prometheus metrics for the server',
					tags: ['Core'],
					response: {
						200: EmptyResponse('Prometheus metrics'),
						501: MessageResponse('Metrics not enabled'),
					},
				},
			},
			async (_, reply): Promise<void> => {
				if (instance.metrics === undefined) {
					await reply.status(501).send({
						message: 'Metrics not enabled',
					});
					return;
				}

				const metrics = await instance.metrics.collect();

				await reply //
					.status(200)
					.header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
					.send(metrics);
			},
		);
	});

	await server.register(async (instance) => {
		instance.addHook('onRequest', tokenHandler);

		const ytdlpVersion = getYtdlpVersion();
		instance.get(
			'/version', //
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
	});
};
