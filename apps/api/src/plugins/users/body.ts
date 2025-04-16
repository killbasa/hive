import { Type } from '@fastify/type-provider-typebox';

export const UserPatchBody = Type.Object({
	newPassword: Type.String({ minLength: 8 }),
	oldPassword: Type.String({ minLength: 8 }),
});

export const UserExistsBody = Type.Object({
	username: Type.String({ minLength: 3 }),
});
