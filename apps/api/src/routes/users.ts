import { checkToken } from '../lib/auth';
import { users } from '../db/schema';
import { db } from '../db/client';
import { config } from '../lib/config';
import { hash, verify } from 'argon2';
import { z } from 'zod';
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

		const UserUpdateSchema = z.object({
			newUsername: z.string().min(3).optional(),
			newPassword: z.string().min(8),
			oldPassword: z.string().min(8)
		});

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

				const data = UserUpdateSchema.parse(request.body);

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

				await reply
					.clearCookie(config.AUTH_COOKIE_NAME, {
						domain: config.AUTH_COOKIE_DOMAIN,
						path: '/'
					})
					.code(204)
					.send();
			}
		);

		done();
	});
};
