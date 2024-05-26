import { db } from '../../db/client.js';
import { users } from '../../db/schema.js';
import { server } from '../../server.js';
import { SQL, eq } from 'drizzle-orm';
import type { onRequestAsyncHookHandler } from 'fastify';

export const authHandler: onRequestAsyncHookHandler = async (request, reply) => {
	try {
		let where: SQL;
		const apiKey = request.headers['x-api-key'] as string | undefined;

		if (apiKey === undefined) {
			await request.jwtVerify();
			where = eq(users.name, request.user.name);
		} else {
			where = eq(users.apiKey, apiKey);
		}

		const user = await db.query.users.findFirst({
			where,
			columns: {
				name: true,
			},
		});

		if (user === undefined) {
			return await reply.code(401).send();
		}

		request.user = {
			name: user.name,
		};
	} catch (err) {
		server.log.error(err);
		await reply.code(401).send();
	}
};
