import { UserPatchSchema } from './schemas.js';
import { checkToken } from '../auth/tokens.js';
import { cookies } from '../auth/cookies.js';
import { db } from '../../db/client.js';
import { users } from '../../db/schema.js';
import { config } from '../../lib/config.js';
import { hash, verify } from 'argon2';
import { eq } from 'drizzle-orm';
import { timingSafeEqual } from 'node:crypto';
import type { FastifyPluginCallback } from 'fastify';

export const userRoutes: FastifyPluginCallback = async (server) => {
	await server.register((instance, _, done) => {
		instance.addHook('onRequest', checkToken);

		instance.get(
			'/', //
			{ schema: { tags: ['Users'] } },
			async (request, reply): Promise<void> => {
				const user = await db.query.users.findFirst({
					where: eq(users.username, request.user.name),
					columns: { username: true }
				});

				if (!user) {
					await reply.code(404).send();
					return;
				}

				await reply.code(200).send({
					username: user.username,
					roles: []
				});
			}
		);

		instance.patch(
			'/', //
			{ schema: { tags: ['Users'] } },
			async (request, reply): Promise<void> => {
				const user = await db.query.users.findFirst({
					where: eq(users.username, request.user.name)
				});
				if (user === undefined) {
					await reply.code(401).send({ message: 'Invalid username or password' });
					return;
				}

				const data = UserPatchSchema.parse(request.body);

				const result = await verify(user.password, data.oldPassword);
				if (!result) {
					await reply.code(401).send({ message: 'Invalid username or password' });
					return;
				}

				if (data.oldPassword.length === data.newPassword.length) {
					const oldPassBuffer = Buffer.from(data.oldPassword);
					const newPassBuffer = Buffer.from(data.newPassword);

					if (timingSafeEqual(oldPassBuffer, newPassBuffer)) {
						await reply.code(401).send({ message: 'Invalid username or password' });
						return;
					}
				}

				const newHash = await hash(data.newPassword);

				await db //
					.update(users)
					.set({
						username: data.newUsername,
						password: newHash
					})
					.where(eq(users.username, request.user.name))
					.execute();

				const cookie = cookies.delete();

				await reply //
					.clearCookie(config.AUTH_COOKIE_NAME, cookie)
					.code(204)
					.send();
			}
		);

		done();
	});
};
