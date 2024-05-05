import { config } from '../../lib/config.js';
import { EmptyResponse } from '../../lib/responses.js';
import type { HiveRoutes } from '../../lib/types/hive.js';
import { cookies } from './cookies.js';
import { credentialAuthRoutes } from './credentials/routes.js';

export const authRoutes: HiveRoutes = {
	subroutes: {
		credentials: credentialAuthRoutes,
	},
	authenticated: (server, _, done) => {
		server.get(
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

		server.post(
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

		done();
	},
};
