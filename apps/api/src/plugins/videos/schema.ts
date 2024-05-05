import { Type } from '@fastify/type-provider-typebox';
import type { Static } from '@fastify/type-provider-typebox';
import { HiveType } from '../../lib/types/typebox.js';

export const VideoTypeSchema = HiveType.LiteralUnion(['video', 'short', 'stream']);
export type VideoType = Static<typeof VideoTypeSchema>;

export const VideoStatusSchema = HiveType.LiteralUnion(['none', 'new', 'live', 'upcoming', 'past']);
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
	uploadDate: HiveType.Nullable(Type.String()),
	type: VideoTypeSchema,
	status: VideoStatusSchema,
	downloadStatus: VideoDownloadStatusSchema,
});

export const VideoListSchema = Type.Object({
	videos: Type.Array(VideoSchema),
	total: Type.Number(),
});

export const VideoCommentSchema = Type.Object({
	id: Type.Number(),
	videoId: Type.String(),
	text: Type.String(),
	author: Type.String(),
	authorId: Type.String(),
	timeText: Type.String(),
	isUploader: Type.Boolean(),
	isFavorited: Type.Boolean(),
});

export const VideoWithCommentsSchema = Type.Composite([
	VideoSchema,
	Type.Object({
		comments: Type.Array(VideoCommentSchema),
	}),
]);
