import { Type } from '@fastify/type-provider-typebox';

export const ChannelQuerySchema = Type.Object({
	page: Type.Number({ default: 1 }),
	limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100, default: 24 })),
});
