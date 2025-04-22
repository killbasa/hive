import { Type } from '@fastify/type-provider-typebox';

export const UserSchema = Type.Object({
	name: Type.String(),
});

export const UserExistsSchema = Type.Object({
	exists: Type.Boolean(),
});
