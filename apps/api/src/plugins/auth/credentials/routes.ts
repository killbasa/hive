import { LoginBody, SignupBody } from './body.js';
import { db } from '../../../db/client.js';
import { users } from '../../../db/schema.js';
import { EmptyResponse, MessageResponse } from '../../../lib/responses.js';
import { cookies } from '../cookies.js';
import { count, eq } from 'drizzle-orm';
import { hash, verify } from 'argon2';
import type { HiveRoutes } from '../../../lib/types/hive.js';

export const credentialAuthRoutes: HiveRoutes = {
	public: (server, _, done) => {
		server.post(
			'/login', //
			{
				schema: {
					description: 'Login to the application',
					tags: ['Auth'],
					body: LoginBody,
					response: {
						200: MessageResponse('Logged in successfully'),
						401: MessageResponse('Invalid username or password'),
					},
				},
			},
			async (request, reply): Promise<void> => {
				const { body } = request;

				const user = await db.query.users.findFirst({
					where: eq(users.name, body.username),
				});
				if (user === undefined) {
					await reply.code(401).send({
						message: 'Invalid username or password',
					});
					return;
				}

				const result = await verify(user.password, body.password);
				if (!result) {
					await reply.code(401).send({
						message: 'Invalid username or password',
					});
					return;
				}

				const token = server.jwt.sign({
					id: user.id,
					name: user.name,
				});

				const cookie = cookies.create({
					extendedExpiry: body.remember,
				});

				await reply //
					.setCookie(server.config.auth.cookie, token, cookie)
					.code(200)
					.send();
			},
		);

		server.put(
			'/signup', //
			{
				schema: {
					description: 'Signup for the application',
					tags: ['Auth'],
					body: SignupBody,
					response: {
						201: EmptyResponse('Account created'),
						403: MessageResponse('User registration is disabled'),
						409: MessageResponse('User already exists'),
					},
				},
			},
			async (request, reply): Promise<void> => {
				const { body } = request;

				// Only single tenant mode is supported at the moment
				const userCount = await db.select({ total: count() }).from(users);
				if (userCount[0].total >= 1) {
					await reply.code(403).send({
						message: 'User registration is disabled',
					});
					return;
				}

				const user = await db.query.users.findFirst({
					where: eq(users.name, body.username),
				});
				if (user !== undefined) {
					await reply.code(409).send({
						message: 'Username already exists',
					});
					return;
				}

				const result = await hash(body.password);

				await db
					.insert(users)
					.values({
						name: body.username,
						password: result,
					})
					.execute();

				await reply.status(201).send();
			},
		);

		done();
	},
};
