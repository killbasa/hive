import { hiveSettings } from './service';
import { SettingsPatchSchema } from './schemas';
import { checkToken } from '../auth/tokens';
import type { FastifyPluginCallback } from 'fastify';

export const settingsRoutes: FastifyPluginCallback = (server, _, done) => {
	server.addHook('onRequest', checkToken);

	server.get(
		'/', //
		{ schema: { tags: ['Settings'] } },
		async (_, reply): Promise<void> => {
			const result = await hiveSettings.get();

			await reply.code(200).send(result);
		}
	);

	server.patch(
		'/', //
		{ schema: { tags: ['Settings'] } },
		async (request, reply): Promise<void> => {
			const data = SettingsPatchSchema.parse(request.body);

			await hiveSettings.set(data);

			await reply.code(200).send();
		}
	);

	done();
};
