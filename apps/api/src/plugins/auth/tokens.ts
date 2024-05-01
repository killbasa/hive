import { db } from '../../db/client.js';
import { users } from '../../db/schema.js';
import { server } from '../../server.js';
import { eq } from 'drizzle-orm';
import type { FastifyReply, FastifyRequest, onRequestAsyncHookHandler } from 'fastify';

export async function checkToken(request: FastifyRequest, reply: FastifyReply): Promise<void> {
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
}

export const tokenHandler: onRequestAsyncHookHandler = async (request, reply) => {
	try {
		await checkToken(request, reply);
	} catch (err) {
		server.log.error(err);
		await reply.code(401).send();
	}
};
