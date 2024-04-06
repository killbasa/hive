import { db } from '../db/client';
import { users } from '../db/schema';
import { config } from '../lib/config';
import { checkToken } from '../lib/auth';
import { Time } from '../lib/utils';
import { z } from 'zod';
import { count, eq } from 'drizzle-orm';
import { hash, verify } from 'argon2';
import type { FastifyPluginCallback } from 'fastify';

export const authRoutes: FastifyPluginCallback = async (server) => {
	await server.register((instance, _, done) => {
		const LoginSchema = z.object({
			username: z.string().min(3),
			password: z.string().min(8),
			remember: z.boolean().default(false)
		});

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

				const offset = data.remember ? Time.Day * 30 : Time.Week;

				await reply
					.setCookie(config.AUTH_COOKIE_NAME, token, {
						domain: config.AUTH_COOKIE_DOMAIN,
						path: '/',
						secure: 'auto',
						httpOnly: true,
						sameSite: 'strict',
						expires: new Date(Date.now() + offset)
					})
					.code(200)
					.send();
			}
		);

		const SignupSchema = z.object({
			username: z.string().min(3),
			password: z.string().min(8)
		});

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
				await reply //
					.clearCookie(config.AUTH_COOKIE_NAME, {
						domain: config.AUTH_COOKIE_DOMAIN,
						path: '/'
					})
					.code(200)
					.send();
			}
		);

		done();
	});
};
