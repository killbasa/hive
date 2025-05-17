import { Type } from '@fastify/type-provider-typebox';

export const ApikeyGetSchema = Type.Object({
	apikeys: Type.Array(
		Type.Object({
			id: Type.String(),
			expires: Type.Optional(Type.String()),
		}),
	),
});

export const ApikeyRefreshSchema = Type.Object({
	apikey: Type.String(),
});
