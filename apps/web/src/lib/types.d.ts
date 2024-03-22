export type Awaitable<T> = T | Promise<T>;

export type FetchFunction = typeof window.fetch;

export type Channel = {
	id: string;
	customUrl: string;
	name: string;
	description: string;
	tags: string;
};

export type Video<T extends boolean = false> = {
	id: string;
	channelId: string;
	playlistId: string;
	title: string;
	description: string;
	duration: string;
	fileSize: string;
	uploadDate: string;
	type: 'video' | 'short' | 'stream';
	status: 'none' | 'new' | 'live' | 'upcoming' | 'past';
	downloadStatus: 'ignored' | 'pending' | 'done';
	comments: T extends true ? VideoComment[] : undefined;
};

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

export type VersionData = {
	api: string;
	ytdlp: string;
};

export type YtdlpProgress = {
	status: 'downloading' | 'error' | 'finished';
	id: string;
	percentage: string;
	total: string;
	speed: string;
	eta: string;
};
