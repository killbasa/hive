import { SettingsPatchSchema } from './schemas.js';
import { tokenHandler } from '../auth/tokens.js';
import type { FastifyPluginCallback } from 'fastify';

export const settingsRoutes: FastifyPluginCallback = (server, _, done) => {
	server.addHook('onRequest', tokenHandler);

	server.get(
		'/', //
		{ schema: { tags: ['Settings'] } },
		async (_, reply): Promise<void> => {
			const result = await server.settings.get();

			await reply.code(200).send(result);
		}
	);

	server.patch(
		'/', //
		{ schema: { tags: ['Settings'] } },
		async (request, reply): Promise<void> => {
			const data = SettingsPatchSchema.parse(request.body);

			await server.settings.set(data);

			await reply.code(200).send();
		}
	);

	done();
};
