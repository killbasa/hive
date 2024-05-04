import { LoginSchema, SignupSchema } from './schemas.js';
import { cookies } from '../cookies.js';
import { db } from '../../../db/client.js';
import { users } from '../../../db/schema.js';
import { config } from '../../../lib/config.js';
import { hash, verify } from 'argon2';
import { count, eq } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';

export const credentialAuthRoutes: FastifyPluginAsync = async (server) => {
	await server.register(async (instance) => {
		instance.post(
			'/login', //
			{ schema: { tags: ['Auth'] }, onRequest: undefined },
			async (request, reply): Promise<void> => {
				const data = LoginSchema.parse(request.body);

				const user = await db.query.users.findFirst({
					where: eq(users.name, data.username)
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
					name: user.name
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
					where: eq(users.name, data.username)
				});
				if (user !== undefined) {
					await reply.code(400).send({ message: 'Username already exists' });
					return;
				}

				const result = await hash(data.password);

				await db
					.insert(users)
					.values({
						name: data.username,
						password: result
					})
					.execute();

				await reply.status(201).send();
			}
		);
	});
};
