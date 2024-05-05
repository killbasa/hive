import { Type } from '@fastify/type-provider-typebox';
import { HiveType } from '../../lib/types/typebox.js';
import type { VideoDownloadStatus } from './schema.js';

export const VideoIgnoreBody = Type.Object({
	videoIds: Type.Array(Type.String()),
});

export const VideoPatchBody = Type.Object({
	downloadStatus: Type.Optional(
		HiveType.LiteralUnion<VideoDownloadStatus[]>(['ignored', 'pending']), //
	),
	watchProgress: Type.Optional(Type.Number()),
});
