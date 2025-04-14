import { Type } from '@fastify/type-provider-typebox';

export const UserExistsSchema = Type.Object({
	exists: Type.Boolean(),
});
