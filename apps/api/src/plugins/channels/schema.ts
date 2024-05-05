import { Type } from '@fastify/type-provider-typebox';

export const ChannelSchema = Type.Object({
	id: Type.String(),
	description: Type.String(),
	tags: Type.Array(Type.String()),
	customUrl: Type.String(),
	name: Type.String(),
});

export const ChanneListSchema = Type.Object({
	channels: Type.Array(ChannelSchema),
	total: Type.Number(),
});
