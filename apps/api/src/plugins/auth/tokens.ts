import { db } from '../../db/client.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import type { onRequestAsyncHookHandler } from 'fastify';

export const checkToken: onRequestAsyncHookHandler = async (request, reply) => {
	try {
		await request.jwtVerify();

		const user = await db.query.users.findFirst({
			where: eq(users.username, request.user.name),
			columns: { username: true }
		});
		if (user === undefined) {
			await reply.code(403).send();
		}
	} catch (err) {
		await reply.send(err);
	}
};
