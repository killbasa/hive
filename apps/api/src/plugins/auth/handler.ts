import { verifyApiKey } from './apikey/service.js';
import { db } from '../../db/sqlite.js';
import { apikeys, users } from '../../db/schema.js';
import { server } from '../../server.js';
import { SQL, eq } from 'drizzle-orm';
import type { FastifyReply, onRequestAsyncHookHandler } from 'fastify';

export const authHandler: onRequestAsyncHookHandler = async (request, reply) => {
	try {
		const headerApikey = request.headers['x-api-key'];
		if (headerApikey === undefined && request.session.get('user')) {
			return;
		}

		if (typeof headerApikey !== 'string' || headerApikey.length === 0) {
			return await reply.code(401).send();
		}

		const user = await db.query.users.findFirst({
			where: await checkApikey(reply, headerApikey),
			columns: {
				id: true,
				name: true,
			},
		});

		if (!user) {
			return await reply.code(401).send();
		}

		request.session.user = {
			id: user.id,
			name: user.name,
		};
	} catch (err) {
		server.log.error(err);
		await reply.code(401).send();
	}
};

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
