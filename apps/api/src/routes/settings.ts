import { db } from '../db/client';
import { settings } from '../db/schema';
import { checkToken } from '../lib/auth';
import type { FastifyPluginCallback } from 'fastify';

export const settingsRoutes: FastifyPluginCallback = (server, _, done) => {
	server.addHook('onRequest', checkToken);

	server.get(
		'/', //
		{ schema: { tags: ['Settings'] } },
		async (_, reply): Promise<void> => {
			const result = await db.query.settings.findFirst();
			if (result === undefined) {
				await reply.code(500).send();
			} else {
				await reply.code(200).send({ settings: result });
			}
		}
	);

	server.patch(
		'/', //
		{ schema: { tags: ['Settings'] } },
		async (_, reply): Promise<void> => {
			await db
				.insert(settings)
				.values({
					id: 'settings'
				})
				.execute();

			await reply.code(200).send();
		}
	);

	done();
};
