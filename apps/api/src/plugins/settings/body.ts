import { Type } from '@fastify/type-provider-typebox';

export const SettingsPatchBody = Type.Object({
	cronSubscription: Type.Optional(Type.String({ minLength: 9 })),
	cronDownload: Type.Optional(Type.String({ minLength: 9 })),
	downloadLimit: Type.Optional(Type.Number()),
});
