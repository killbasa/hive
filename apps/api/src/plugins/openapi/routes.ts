import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { isDev } from '../../lib/constants.js';
import { ScalarContentSecurityPolicies, ScalarHTML } from './constants.js';

export const referenceRoutes: FastifyPluginAsyncTypebox = async (server) => {
	server.get(
		'/spec.json',
		{
			schema: {
				description: 'Get the OpenAPI spec',
				tags: ['Open API'],
			},
		},
		async (_, reply): Promise<void> => {
			await reply
				.headers({
					'Content-Type': 'application/json; charset=utf-8',
				})
				.send(server.swagger());
		},
	);

	server.get(
		'/reference', //
		{ schema: { hide: true } },
		async (_, reply): Promise<void> => {
			await reply
				.headers({
					'Content-Type': 'text/html; charset=utf-8',
					'Content-Security-Policy': ScalarContentSecurityPolicies,
				})
				.send(ScalarHTML);
		},
	);

	if (isDev) {
		server.addContentTypeParser<string>(
			'application/csp-report', //
			{ parseAs: 'string' },
			(_, payload, done) => {
				done(null, JSON.parse(payload));
			},
		);

		server.post(
			'/csp', //
			{ schema: { hide: true } },
			async (request, reply): Promise<void> => {
				server.log.info(request.body);

				await reply.status(200).send();
			},
		);
	}
};
