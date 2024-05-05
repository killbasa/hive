import { Type } from '@fastify/type-provider-typebox';

export const ChannelQuerySchema = Type.Object({
	page: Type.Number({ default: 1 }),
});
