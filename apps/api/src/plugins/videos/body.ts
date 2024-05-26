import { HiveType } from '../../lib/types/typebox.js';
import { Type } from '@fastify/type-provider-typebox';
import type { VideoDownloadStatus } from './schema.js';

export const VideoIgnoreBody = Type.Object({
	videoIds: Type.Array(Type.String()),
});

export const VideoPatchBody = Type.Object({
	watchProgress: Type.Optional(Type.Number()),
	watchCompleted: Type.Optional(Type.Boolean()),
	downloadStatus: Type.Optional(
		HiveType.LiteralUnion<VideoDownloadStatus[]>(['ignored', 'pending']), //
	),
});
