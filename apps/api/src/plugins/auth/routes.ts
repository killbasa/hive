import { cookies } from './cookies.js';
import { credentialAuthRoutes } from './credentials/routes.js';
import { apikeyAuthRoutes } from './apikey/routes.js';
import { EmptyResponse } from '../../lib/responses.js';
import type { HiveRoutes } from '../../lib/types/hive.js';

export const authRoutes: HiveRoutes = {
	subroutes: {
		credentials: credentialAuthRoutes,
		apikey: apikeyAuthRoutes,
	},
	authenticated: (server, _, done) => {
		server.get(
			'/verify', //
			{
				schema: {
					description: 'Verify the user is authenticated',
					tags: ['Auth'],
					security: [{ apikey: ['x-api-key'] }],
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

		server.post(
			'/logout', //
			{
				schema: {
					description: 'Logout the user',
					tags: ['Auth'],
					security: [{ apikey: ['x-api-key'] }],
					response: {
						200: EmptyResponse('Logged out successfully'),
					},
				},
			},
			async (_, reply): Promise<void> => {
				const cookie = cookies.delete();

				await reply //
					.clearCookie(server.config.auth.cookie, cookie)
					.code(200)
					.send();
			},
		);

		done();
	},
};
