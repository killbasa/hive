import { Type } from '@fastify/type-provider-typebox';

export const UserSchema = Type.Object({
	name: Type.String(),
});
