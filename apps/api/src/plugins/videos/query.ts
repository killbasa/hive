import { VideoDownloadStatusSchema, VideoStatusSchema, VideoTypeSchema } from './schema.js';
import { Type } from '@fastify/type-provider-typebox';

export const VideoListGetQuery = Type.Object({
	page: Type.Number({ minimum: 1, default: 1 }),
	type: Type.Optional(Type.Array(VideoTypeSchema)),
	status: Type.Optional(Type.Array(VideoStatusSchema)),
	downloadStatus: Type.Optional(Type.Array(VideoDownloadStatusSchema)),
	channelId: Type.Optional(Type.String()),
	search: Type.Optional(Type.String()),
	inProgress: Type.Optional(Type.Boolean({ default: false })),
});

export const VideoGetQuery = Type.Object({
	videoId: Type.String(),
});

export const VideoPatchQuery = Type.Object({
	videoId: Type.String(),
});
