import { Type } from '@fastify/type-provider-typebox';

export const DownloadStartBody = Type.Object({
	videoIds: Type.Array(Type.String()),
});
