import { Type } from '@fastify/type-provider-typebox';

export const ChannelPostBody = Type.Object({
	id: Type.String(),
});
