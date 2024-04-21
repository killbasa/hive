import { db } from '../../db/client.js';
import { users } from '../../db/schema.js';
import { server } from '../../server.js';
import { eq } from 'drizzle-orm';
import type { onRequestAsyncHookHandler } from 'fastify';

export const checkToken: onRequestAsyncHookHandler = async (request, reply) => {
	try {
		await request.jwtVerify();

		const user = await db.query.users.findFirst({
			where: eq(users.name, request.user.name),
			columns: {
				name: true
			}
		});

		if (user === undefined) {
			return await reply.code(401).send();
		}

		request.user = {
			name: user.name
		};
	} catch (err) {
		server.log.error(err);
		await reply.code(401).send();
	}
};
