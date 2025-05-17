import { generateApiKey } from './service.js';
import { ApikeyGetSchema, ApikeyRefreshSchema } from './schema.js';
import { ApikeyRevokeBody } from './body.js';
import { db } from '../../../db/client.js';
import { apikeys, users } from '../../../db/schema.js';
import { EmptyResponse } from '../../../lib/responses.js';
import { eq } from 'drizzle-orm';
import type { HiveRoutes } from '../../../lib/types/hive.js';

export const apikeyAuthRoutes: HiveRoutes = {
	authenticated: (server, _, done) => {
		server.get(
			'/',
			{
				schema: {
					description: 'Get all API keys for the user',
					tags: ['Auth'],
					response: {
						200: ApikeyGetSchema,
					},
				},
			},
			async (request, reply): Promise<void> => {
				const result = await db.query.apikeys.findMany({
					where: eq(apikeys.userId, request.user.id),
					columns: {
						id: true,
						expires: true,
					},
				});

				await reply.code(200).send({
					apikeys: result.map((apikey) => ({
						id: apikey.id,
						expires: apikey.expires?.toISOString(),
					})),
				});
			},
		);

		server.post(
			'/refresh', //
			{
				schema: {
					description: 'Generate a new API key',
					tags: ['Auth'],
					response: {
						200: ApikeyRefreshSchema,
					},
				},
			},
			async (request, reply): Promise<void> => {
				const user = await db.query.users.findFirst({
					where: eq(users.name, request.user.name),
				});
				if (user === undefined) {
					await reply.code(403).send();
					return;
				}

				const { kid, apikey, hashedkey } = generateApiKey();

				await db //
					.insert(apikeys)
					.values({
						id: kid,
						userId: user.id,
						apikey: hashedkey,
						expires: undefined,
					})
					.execute();

				await reply.code(200).send({
					apikey,
				});
			},
		);

		server.post(
			'/revoke',
			{
				schema: {
					description: 'Revoke an API key',
					tags: ['Auth'],
					body: ApikeyRevokeBody,
					response: {
						204: EmptyResponse('API key revoked'),
					},
				},
			},
			async (request, reply): Promise<void> => {
				const { body } = request;

				await db //
					.delete(apikeys)
					.where(eq(apikeys.id, body.id))
					.execute();

				await reply.code(204).send();
			},
		);

		done();
	},
};
