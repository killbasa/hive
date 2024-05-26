export type ChannelMetadata = {
	id: string;
	channel: string;
	channel_id: string;
	uploader_id: string;
	description: string;
	tags: string[];
};

export type VideoMetadata = {
	/** Video identifier */
	id: string;
	/** Video title */
	title: string;
	/** The description of the video */
	description: string;
	/** UNIX timestamp of the moment the video became available */
	timestamp: number;
	/** Length of the video (HH:mm:ss) */
	duration_string?: string;
	/** Whether this video is a live stream or a fixed-length video */
	is_live: boolean;
	/** Whether this video was originally a live stream */
	was_live: boolean;
	/** One of "not_live", "is_live", "is_upcoming", "was_live", "post_live" (was live, but VOD is not yet processed) */
	live_status: 'is_live' | 'is_upcoming' | 'not_live' | 'post_live' | 'was_live';
	/** An estimate for the number of bytes */
	filesize_approx: number;
	/** Width of the video, if known */
	width: number;
	/** Height of the video, if known */
	height: number;
	/** Aspect ratio of the video, if known */
	aspect_ratio: number;
};

export type CommentMetadata = {
	text: string;
	author_id: string;
	author: string;
	_time_text: string;
	author_is_uploader: boolean;
	is_favorited: boolean;
};
