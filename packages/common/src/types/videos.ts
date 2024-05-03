import { LiteralUnion } from './generic';
import { Type } from '@sinclair/typebox';

export type VideoComment = {
	id: string;
	videoId: string;
	text: string;
	author: string;
	authorId: string;
	timeText: string;
	isUploader: boolean;
	isFavorited: boolean;
};

export type Video = {
	id: string;
	channelId: string;
	playlistId: string;
	title: string;
	description: string;
	duration: string;
	fileSize: string;
	uploadDate: string;
	watchProgress: string;
	type: 'short' | 'stream' | 'video';
	status: 'live' | 'new' | 'none' | 'past' | 'upcoming';
	downloadStatus: 'done' | 'ignored' | 'pending';
};

export type VideoWithComments = Video & {
	comments: VideoComment[];
};

export type VideoType = Video['type'];
export const VideoTypes: VideoType[] = ['video', 'short', 'stream'] as const;

export type VideoStatus = Video['status'];
export const VideoStatuses: VideoStatus[] = ['none', 'new', 'live', 'upcoming', 'past'] as const;

export type VideoDownloadStatus = Video['downloadStatus'];
export const VideoDownloadStatuses: VideoDownloadStatus[] = ['ignored', 'pending', 'done'] as const;

export const VideoQuerySchema = Type.Object({
	page: Type.Number({ minimum: 1, default: 1 }),
	type: Type.Optional(Type.Array(LiteralUnion(VideoTypes))),
	status: Type.Optional(Type.Array(LiteralUnion(VideoStatuses))),
	downloadStatus: Type.Optional(Type.Array(LiteralUnion(VideoDownloadStatuses))),
	channelId: Type.Optional(Type.String()),
	search: Type.Optional(Type.String()),
	inProgress: Type.Boolean({ default: false })
});

export const VideoIgnoreSchema = Type.Object({
	videoIds: Type.Array(Type.String())
});

export const VideoPatchSchema = Type.Object({
	downloadStatus: Type.Union([Type.Literal('ignored'), Type.Literal('pending')])
});

export const VideoProgressSchema = Type.Object({
	progress: Type.Number()
});
