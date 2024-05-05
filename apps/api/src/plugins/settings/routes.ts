import { EmptyResponse } from '../../lib/responses.js';
import type { HiveRoutes } from '../../lib/types/hive.js';
import { setDownloadCronTask, setScanCronTask } from '../tasks/handlers/repeat.js';
import { SettingsPatchBody } from './body.js';
import { parseCron } from './cron.js';
import { SettingsSchema } from './schema.js';

export const settingsRoutes: HiveRoutes = {
	authenticated: (server, _, done) => {
		server.get(
			'', //
			{
				schema: {
					description: 'Get the settings',
					tags: ['Settings'],
					response: {
						200: SettingsSchema,
					},
				},
			},
			async (_, reply): Promise<void> => {
				const result = await server.settings.get();

				await reply.code(200).send(result);
			},
		);

		server.patch(
			'', //
			{
				schema: {
					description: 'Update the settings',
					tags: ['Settings'],
					body: SettingsPatchBody,
					response: {
						204: EmptyResponse('Settings updated successfully'),
					},
				},
			},
			async (request, reply): Promise<void> => {
				const { body } = request;

				if (body.cronSubscription !== undefined) {
					const result = parseCron(body.cronSubscription);

					if (result !== null) {
						await setScanCronTask(body.cronSubscription);
					}
				}

				if (body.cronDownload !== undefined) {
					const result = parseCron(body.cronDownload);

					if (result !== null) {
						await setDownloadCronTask(body.cronSubscription);
					}
				}

				await server.settings.set(body);

				await reply.code(204).send();
			},
		);

		done();
	},
};
