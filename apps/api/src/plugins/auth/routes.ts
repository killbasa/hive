import { cookies } from './cookies.js';
import { credentialAuthRoutes } from './credentials/routes.js';
import { checkToken } from './tokens.js';
import { config } from '../../lib/config.js';
import type { FastifyPluginCallback } from 'fastify';

export const authRoutes: FastifyPluginCallback = async (server) => {
	await server.register(credentialAuthRoutes, { prefix: 'credentials' });

	await server.register((instance, _, done) => {
		instance.addHook('onRequest', checkToken);

		instance.get(
			'/verify', //
			{ schema: { tags: ['Auth'] } },
			async (_, reply): Promise<void> => {
				// const requestPath = request.headers['x-original-uri'];

				await reply.code(200).send();
			}
		);

		instance.post(
			'/logout', //
			{ schema: { tags: ['Auth'] } },
			async (_, reply): Promise<void> => {
				const cookie = cookies.delete();

				await reply //
					.clearCookie(config.AUTH_COOKIE_NAME, cookie)
					.code(200)
					.send();
			}
		);

		done();
	});
};
