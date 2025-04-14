import { Type } from '@fastify/type-provider-typebox';

export const UserExistsBody = Type.Object({
	username: Type.String({ minLength: 3 }),
});
