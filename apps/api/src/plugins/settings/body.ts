import { HiveType } from '../../lib/types/typebox.js';
import { Type } from '@fastify/type-provider-typebox';

export const SettingsPatchBody = Type.Object({
	cronCheckSubscriptions: HiveType.Nullable(Type.String()),
	cronDownloadPending: HiveType.Nullable(Type.String()),
	cronChannelMetadata: HiveType.Nullable(Type.String()),
	downloadLimit: Type.Optional(Type.Number()),
});
