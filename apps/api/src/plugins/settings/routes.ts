import { SettingsPatchBody } from './body.js';
import { parseCron } from './cron.js';
import { SettingsSchema } from './schema.js';
import { RepeatJobIds, setRepeatJob } from '../../tasks/handlers/repeat.js';
import { EmptyResponse } from '../../lib/responses.js';
import { server as serverCore } from '../../server.js';
import type { HiveRoutes } from '../../lib/types/hive.js';

export const settingsRoutes: HiveRoutes = {
	authenticated: (server, _, done) => {
		server.get(
			'', //
			{
				schema: {
					description: 'Get the settings',
					tags: ['Settings'],
					security: [{ apikey: ['x-api-key'] }],
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
					security: [{ apikey: ['x-api-key'] }],
					body: SettingsPatchBody,
					response: {
						204: EmptyResponse('Settings updated successfully'),
					},
				},
			},
			async (request, reply): Promise<void> => {
				const { body } = request;

				await applyCronChanges(body);
				await server.settings.set(body);

				await reply.code(204).send();
			},
		);

		done();
	},
};

async function applyCronChanges(data: typeof SettingsPatchBody.static): Promise<void> {
	const {
		cronCheckSubscriptions, //
		cronDownloadPending,
		cronChannelMetadata,
	} = await serverCore.settings.get();

	if (data.cronCheckSubscriptions !== cronCheckSubscriptions) {
		if (data.cronCheckSubscriptions === null) {
			await setRepeatJob(RepeatJobIds.ScanChannels, null);
		} else {
			const result = parseCron(data.cronCheckSubscriptions);

			if (result !== null) {
				await setRepeatJob(RepeatJobIds.ScanChannels, data.cronCheckSubscriptions);
			}
		}
	}

	if (data.cronDownloadPending !== cronDownloadPending) {
		if (data.cronDownloadPending === null) {
			await setRepeatJob(RepeatJobIds.DownloadPending, null);
		} else {
			const result = parseCron(data.cronDownloadPending);

			if (result !== null) {
				await setRepeatJob(RepeatJobIds.DownloadPending, data.cronDownloadPending);
			}
		}
	}

	if (data.cronChannelMetadata !== cronChannelMetadata) {
		if (data.cronChannelMetadata === null) {
			await setRepeatJob(RepeatJobIds.ChannelMetadata, null);
		} else {
			const result = parseCron(data.cronChannelMetadata);

			if (result !== null) {
				await setRepeatJob(RepeatJobIds.ChannelMetadata, data.cronChannelMetadata);
			}
		}
	}
}
