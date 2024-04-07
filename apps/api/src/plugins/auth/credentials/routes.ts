import { LoginSchema, SignupSchema } from './schemas.js';
import { checkToken } from '../tokens.js';
import { cookies } from '../cookies.js';
import { db } from '../../../db/client.js';
import { users } from '../../../db/schema.js';
import { config } from '../../../lib/config.js';
import { hash, verify } from 'argon2';
import { count, eq } from 'drizzle-orm';
import type { FastifyPluginCallback } from 'fastify';

export const authRoutes: FastifyPluginCallback = async (server) => {
	await server.register((instance, _, done) => {
		instance.post(
			'/login', //
			{ schema: { tags: ['Auth'] }, onRequest: undefined },
			async (request, reply): Promise<void> => {
				const data = LoginSchema.parse(request.body);

				const user = await db.query.users.findFirst({
					where: eq(users.username, data.username)
				});
				if (user === undefined) {
					await reply.code(401).send({ message: 'Invalid username or password' });
					return;
				}

				const result = await verify(user.password, data.password);
				if (!result) {
					await reply.code(401).send({ message: 'Invalid username or password' });
					return;
				}

				const token = server.jwt.sign({
					name: user.username
				});

				const cookie = cookies.create(data.remember);

				await reply //
					.setCookie(config.AUTH_COOKIE_NAME, token, cookie)
					.code(200)
					.send();
			}
		);

		instance.post(
			'/signup', //
			{ schema: { tags: ['Auth'] }, onRequest: undefined },
			async (request, reply): Promise<void> => {
				// Only single tenant mode is supported at the moment
				const userCount = await db.select({ total: count() }).from(users);
				if (userCount[0].total >= 1) {
					await reply.code(400).send({ message: 'User registration is disabled' });
					return;
				}

				const data = SignupSchema.parse(request.body);

				const user = await db.query.users.findFirst({
					where: eq(users.username, data.username)
				});
				if (user !== undefined) {
					await reply.code(400).send({ message: 'Username already exists' });
					return;
				}

				const result = await hash(data.password);

				await db
					.insert(users)
					.values({
						username: data.username,
						password: result
					})
					.execute();

				await reply.status(201).send();
			}
		);

		done();
	});

	await server.register((instance, _, done) => {
		instance.addHook('onRequest', checkToken);

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
