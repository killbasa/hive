import { verifyApiKey } from './apikey/service.js';
import { db } from '../../db/client.js';
import { apikeys, users } from '../../db/schema.js';
import { server } from '../../server.js';
import { SQL, eq } from 'drizzle-orm';
import type { FastifyReply, FastifyRequest, onRequestAsyncHookHandler } from 'fastify';

export const authHandler: onRequestAsyncHookHandler = async (request, reply) => {
	try {
		let where: SQL;
		const headerApikey = request.headers['x-api-key'];

		if (headerApikey === undefined) {
			where = await checkJwt(request);
		} else {
			if (typeof headerApikey !== 'string' || headerApikey.length === 0) {
				return await reply.code(401).send();
			}

			where = await checkApikey(reply, headerApikey);
		}

		const user = await db.query.users.findFirst({
			where,
			columns: {
				id: true,
				name: true,
			},
		});

		if (!user) {
			return await reply.code(401).send();
		}

		request.user = {
			id: user.id,
			name: user.name,
		};
	} catch (err) {
		server.log.error(err);
		await reply.code(401).send();
	}
};

async function checkJwt(request: FastifyRequest): Promise<SQL> {
	await request.jwtVerify();
	return eq(users.name, request.user.name);
}

async function checkApikey(reply: FastifyReply, apikey: string): Promise<SQL> {
	const keyId = apikey.split('.').at(1);
	if (!keyId) {
		return await reply.code(401).send();
	}

	const storedApikey = await db.query.apikeys.findFirst({
		where: eq(apikeys.id, keyId),
		columns: {
			apikey: true,
			userId: true,
			expires: false,
		},
	});
	if (storedApikey === undefined) {
		return await reply.code(401).send();
	}

	const isValid = verifyApiKey(apikey, storedApikey.apikey);
	if (!isValid) {
		return await reply.code(401).send();
	}

	return eq(users.id, storedApikey.userId);
}
