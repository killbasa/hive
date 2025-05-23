import { HiveType } from '../../lib/types/typebox.js';
import { Type } from '@fastify/type-provider-typebox';
import type { Static } from '@fastify/type-provider-typebox';

export const VideoTypeSchema = HiveType.LiteralUnion(['unknown', 'video', 'short', 'stream']);
export type VideoType = Static<typeof VideoTypeSchema>;

export const VideoStatusSchema = HiveType.LiteralUnion(['unknown', 'none', 'live', 'upcoming', 'past']);
export type VideoStatus = Static<typeof VideoStatusSchema>;

export const VideoDownloadStatusSchema = HiveType.LiteralUnion(['ignored', 'pending', 'done']);
export type VideoDownloadStatus = Static<typeof VideoDownloadStatusSchema>;

export const VideoSchema = Type.Object({
	id: Type.String(),
	channelId: Type.String(),
	playlistId: HiveType.Nullable(Type.String()),
	title: Type.String(),
	description: Type.String(),
	duration: HiveType.Nullable(Type.Number()),
	watchProgress: Type.Number(),
	watchCompleted: Type.Boolean(),
	fileSize: HiveType.Nullable(Type.Number()),
	uploadDate: HiveType.Nullable(Type.Number()),
	type: VideoTypeSchema,
	status: VideoStatusSchema,
	downloadStatus: VideoDownloadStatusSchema,
});

export const VideoListSchema = Type.Object({
	videos: Type.Array(VideoSchema),
	total: Type.Number(),
});
