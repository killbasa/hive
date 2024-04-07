export type ChannelMetadata = {
	id: string;
	channel: string;
	channel_id: string;
	uploader_id: string;
	description: string;
	tags: string[];
};

export type VideoMetadata = {
	id: string;
	title: string;
	description: string;
	upload_date: string;
	duration_string: string;
	was_live: boolean;
	live_status: 'is_upcoming' | 'not_live';
	filesize_approx: number;
	width: number;
	height: number;
};

export type CommentMetadata = {
	text: string;
	author_id: string;
	author: string;
	_time_text: string;
	author_is_uploader: boolean;
	is_favorited: boolean;
};
