import { Type } from '@fastify/type-provider-typebox';

export const ApikeyRevokeBody = Type.Object({
	id: Type.String(),
});
