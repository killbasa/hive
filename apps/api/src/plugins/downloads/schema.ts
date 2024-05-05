import { Type } from '@fastify/type-provider-typebox';

export const DownloadCurrentSchema = Type.Object({
	current: Type.Optional(
		Type.Object({
			id: Type.String(),
			channelId: Type.String(),
			title: Type.String(),
		}),
	),
});
