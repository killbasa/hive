import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { hash, verify } from 'argon2';
import { eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { users } from '../../db/schema.js';
import { config } from '../../lib/config.js';
import { EmptyResponse, MessageResponse } from '../../lib/responses.js';
import { cookies } from '../auth/cookies.js';
import { tokenHandler } from '../auth/tokens.js';
import { UserPatchBody } from './body.js';
import { UserSchema } from './schema.js';

export const userRoutes: FastifyPluginAsyncTypebox = async (server) => {
	server.addHook('onRequest', tokenHandler);

	server.get(
		'', //
		{
			schema: {
				description: 'Get the user for the current request',
				tags: ['Users'],
				response: {
					200: UserSchema,
					404: EmptyResponse('User not found'),
				},
			},
		},
		async (request, reply): Promise<void> => {
			const user = await db.query.users.findFirst({
				where: eq(users.name, request.user.name),
				columns: { name: true },
			});

			if (!user) {
				await reply.code(404).send();
				return;
			}

			await reply.code(200).send({
				username: user.name,
			});
		},
	);

	server.patch(
		'', //
		{
			schema: {
				description: 'Update a user',
				tags: ['Users'],
				body: UserPatchBody,
				response: {
					204: EmptyResponse('User updated successfully'),
					401: MessageResponse('Invalid username or password'),
				},
			},
		},
		async (request, reply): Promise<void> => {
			const user = await db.query.users.findFirst({
				where: eq(users.name, request.user.name),
			});
			if (user === undefined) {
				await reply.code(401).send({
					message: 'Invalid username or password',
				});
				return;
			}

			const result = await verify(user.password, request.body.oldPassword);
			if (!result) {
				await reply.code(401).send({
					message: 'Invalid username or password',
				});
				return;
			}

			const newHash = await hash(request.body.newPassword);

			await db //
				.update(users)
				.set({
					password: newHash,
				})
				.where(eq(users.name, request.user.name))
				.execute();

			const cookie = cookies.delete();

			await reply //
				.clearCookie(config.AUTH_COOKIE_NAME, cookie)
				.code(204)
				.send();
		},
	);
};
