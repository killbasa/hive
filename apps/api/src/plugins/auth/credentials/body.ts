import { Type } from '@fastify/type-provider-typebox';

export const LoginBody = Type.Object({
	username: Type.String({ minLength: 3 }),
	password: Type.String({ minLength: 8 }),
	remember: Type.Boolean({ default: false }),
});

export const SignupBody = Type.Object({
	username: Type.String({ minLength: 3 }),
	password: Type.String({ minLength: 8 }),
});
