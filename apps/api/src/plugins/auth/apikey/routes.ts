import type { HiveRoutes } from '../../../lib/types/hive.js';

export const apikeyAuthRoutes: HiveRoutes = {
	public: (server, _, done) => {
		server.post(
			'/create', //
			{
				schema: {
					description: 'Create an API key',
					tags: ['Auth'],
					response: {},
				},
			},
			async (_, reply): Promise<void> => {
				await reply.status(200).send();
			},
		);

		server.post(
			'/delete', //
			{
				schema: {
					description: 'Delete an API key',
					tags: ['Auth'],
					response: {},
				},
			},
			async (_, reply): Promise<void> => {
				await reply.status(200).send();
			},
		);

		server.get(
			'/list', //
			{
				schema: {
					description: 'Get a list of API keys',
					tags: ['Auth'],
					response: {},
				},
			},
			async (_, reply): Promise<void> => {
				await reply.status(200).send();
			},
		);

		done();
	},
};
