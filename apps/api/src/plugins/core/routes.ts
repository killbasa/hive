import { tokenHandler } from '../auth/tokens.js';
import { getYtdlpVersion } from '../../lib/ytdlp/constants.js';
import type { FastifyPluginAsync } from 'fastify';

export const coreRoutes: FastifyPluginAsync = async (server) => {
	await server.register((instance, _, done) => {
		instance.get(
			'/heartbeat', //
			async (_, reply): Promise<void> => {
				await reply.send({ message: 'OK' });
			}
		);

		instance.get(
			'/metrics', //
			async (_, reply): Promise<void> => {
				if (instance.metrics === undefined) {
					await reply.status(501).send({ message: 'Metrics not enabled' });
					return;
				}

				const metrics = await instance.metrics.collect();

				await reply //
					.status(200)
					.header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
					.send(metrics);
			}
		);

		done();
	});

	await server.register((instance, _, done) => {
		instance.addHook('onRequest', tokenHandler);

		const ytdlpVersion = getYtdlpVersion();
		const apiVersion = process.env.npm_package_version;
		instance.get(
			'/version', //
			async (_, reply): Promise<void> => {
				await reply.send({
					api: apiVersion,
					ytdlp: ytdlpVersion
				});
			}
		);

		done();
	});
};
