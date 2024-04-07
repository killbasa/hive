export type Video<T extends boolean = false> = {
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
