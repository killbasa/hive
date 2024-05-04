import { ScalarContentSecurityPolicies, ScalarHTML } from './constants.js';
import type { FastifyPluginAsync } from 'fastify';

export const referenceRoutes: FastifyPluginAsync = async (server) => {
	server.get(
		'/spec.json', //
		{ schema: { hide: true } },
		async (_, reply): Promise<void> => {
			await reply
				.headers({
					'Content-Type': 'application/json; charset=utf-8'
				})
				.send(server.swagger());
		}
	);

	server.get(
		'/reference', //
		{ schema: { hide: true } },
		async (_, reply): Promise<void> => {
			await reply
				.headers({
					'Content-Type': 'text/html; charset=utf-8',
					'Content-Security-Policy': ScalarContentSecurityPolicies
				})
				.send(ScalarHTML);
		}
	);
};
