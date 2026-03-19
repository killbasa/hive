import { cookies } from './cookies.js';
import { credentialAuthRoutes } from './credentials/routes.js';
import { apikeyAuthRoutes } from './apikey/routes.js';
import { EmptyResponse } from '../../lib/responses.js';
import type { HiveRoutes } from '../../lib/types/hive.js';

export const authRoutes: HiveRoutes = {
	subroutes: {
		credentials: credentialAuthRoutes,
		apikeys: apikeyAuthRoutes,
	},
	authenticated: (server, _, done) => {
		// Middleware checks if the user is authenticated
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

		done();
	},
	public: (server, _, done) => {
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
					.clearCookie(server.config.auth.cookie, cookie)
					.code(200)
					.send();
			},
		);

		done();
	},
};
