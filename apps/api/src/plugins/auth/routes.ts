import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { config } from '../../lib/config.js';
import { EmptyResponse } from '../../lib/responses.js';
import { cookies } from './cookies.js';
import { credentialAuthRoutes } from './credentials/routes.js';
import { tokenHandler } from './tokens.js';

export const authRoutes: FastifyPluginAsyncTypebox = async (server) => {
	await server.register(credentialAuthRoutes, { prefix: 'credentials' });

	await server.register(async (instance) => {
		instance.addHook('onRequest', tokenHandler);

		instance.get(
			'/verify', //
			{
				schema: {
					description: 'Verify the user is authenticated',
					tags: ['Auth'],
					response: {
						200: EmptyResponse('User is authenticated'),
					},
				},
			},
			async (_, reply): Promise<void> => {
				// const requestPath = request.headers['x-original-uri'];

				await reply.code(200).send();
			},
		);

		instance.post(
			'/logout', //
			{
				schema: {
					description: 'Logout the user',
					tags: ['Auth'],
					response: {
						200: EmptyResponse('Logged out successfully'),
					},
				},
			},
			async (_, reply): Promise<void> => {
				const cookie = cookies.delete();

				await reply //
					.clearCookie(config.AUTH_COOKIE_NAME, cookie)
					.code(200)
					.send();
			},
		);
	});
};
