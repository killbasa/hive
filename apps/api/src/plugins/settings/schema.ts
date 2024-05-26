import { HiveType } from '../../lib/types/typebox.js';
import { Type } from '@fastify/type-provider-typebox';

export const SettingsSchema = Type.Object({
	cronCheckSubscriptions: HiveType.Nullable(Type.String()),
	cronDownloadPending: HiveType.Nullable(Type.String()),
	cronChannelMetadata: HiveType.Nullable(Type.String()),
	downloadLimit: HiveType.Nullable(Type.Number()),
});
