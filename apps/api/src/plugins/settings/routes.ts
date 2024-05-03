import { SettingsPatchSchema } from './schemas.js';
import { parseCron } from './cron.js';
import { tokenHandler } from '../auth/tokens.js';
import { setDownloadCronTask, setScanCronTask } from '../tasks/handlers/repeat.js';
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

			if (data.cronSubscription !== undefined) {
				const result = parseCron(data.cronSubscription);

				if (result !== null) {
					await setScanCronTask(data.cronSubscription);
				}
			}

			if (data.cronDownload !== undefined) {
				const result = parseCron(data.cronDownload);

				if (result !== null) {
					await setDownloadCronTask(data.cronSubscription);
				}
			}

			await server.settings.set(data);

			await reply.code(200).send();
		}
	);

	done();
};
