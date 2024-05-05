import { Type } from '@fastify/type-provider-typebox';
import { HiveType } from '../../lib/types/typebox.js';

export const SettingsSchema = Type.Object({
	cronSubscription: Type.String(),
	cronDownload: Type.String(),
	downloadLimit: HiveType.Nullable(Type.Number()),
});
