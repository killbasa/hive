import { cookies } from './cookies.js';
import { credentialAuthRoutes } from './credentials/routes.js';
import { apikeyAuthRoutes } from './apikey/routes.js';
import { UserExistsBody } from './body.js';
import { UserExistsSchema } from './schema.js';
import { EmptyResponse } from '../../lib/responses.js';
import { db } from '../../db/client.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
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
					.clearCookie(server.config.COOKIE_NAME, cookie)
					.code(200)
					.send();
			},
		);

		done();
	},
	public: (server, _, done) => {
		server.post(
			'/exists', //
			{
				schema: {
					description: 'Check if a user exists',
					tags: ['Auth'],
					body: UserExistsBody,
					response: {
						200: UserExistsSchema,
					},
				},
			},
			async (request, reply): Promise<void> => {
				const { body } = request;

				const user = await db.query.users.findFirst({
					where: eq(users.name, body.username),
					columns: { name: true },
				});

				await reply.status(200).send({
					exists: user !== undefined,
				});
			},
		);

		done();
	},
};
