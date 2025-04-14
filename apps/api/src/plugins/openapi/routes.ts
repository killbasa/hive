import { ScalarContentSecurityPolicies, ScalarFonts, ScalarHTML, ScalarJS } from './constants.js';
import { isDev } from '../../lib/constants.js';
import type { HiveRoutes } from '../../lib/types/hive.js';

export const referenceRoutes: HiveRoutes = {
	public: (server, _, done) => {
		server.get(
			'/spec.json',
			{
				schema: {
					description: 'Get the OpenAPI JSON spec',
					tags: ['OpenAPI'],
				},
			},
			async (_, reply): Promise<void> => {
				await reply
					.headers({
						'content-type': 'application/json; charset=utf-8',
					})
					.send(server.swagger({ yaml: false }));
			},
		);

		server.get(
			'/spec.yaml',
			{
				schema: {
					description: 'Get the OpenAPI YAML spec',
					tags: ['OpenAPI'],
				},
			},
			async (_, reply): Promise<void> => {
				await reply
					.headers({
						'content-type': 'text/plain; charset=utf-8',
					})
					.send(server.swagger({ yaml: true }));
			},
		);

		server.get(
			'/scalar.js',
			{
				schema: { hide: true },
			},
			async (_, reply): Promise<void> => {
				await reply
					.headers({
						'content-type': 'application/javascript; charset=utf-8',
					})
					.send(ScalarJS);
			},
		);

		server.get(
			'/inter-latin.woff2',
			{
				schema: { hide: true },
			},
			async (_, reply): Promise<void> => {
				await reply
					.headers({
						'content-type': 'font/woff2; charset=utf-8',
						'cache-control': 'public, max-age=604800',
					})
					.send(ScalarFonts.Inter);
			},
		);

		server.get(
			'/mono-latin.woff2',
			{
				schema: { hide: true },
			},
			async (_, reply): Promise<void> => {
				await reply
					.headers({
						'content-type': 'font/woff2; charset=utf-8',
						'cache-control': 'public, max-age=604800',
					})
					.send(ScalarFonts.Mono);
			},
		);

		server.get(
			'/reference', //
			{
				schema: { hide: true },
			},
			async (_, reply): Promise<void> => {
				await reply
					.headers({
						'content-type': 'text/html; charset=utf-8',
						'content-security-policy': ScalarContentSecurityPolicies,
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

		done();
	},
};
