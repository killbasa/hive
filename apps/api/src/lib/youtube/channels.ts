import { ytFetch } from './fetch';

export async function doesChannelExist(channelId: string): Promise<boolean> {
	const url = new URL(`https://www.youtube.com/channel/${channelId}`);

	const response = await fetch(url.href, {
		method: 'HEAD'
	});

	return response.status === 200;
}

export type YouTubeChannelList = {
	items: YouTubeChannel[];
};

export type YouTubeChannel = {
	id: string;
	snippet: YouTubeChannelSnippet;
};

export type YouTubeChannelSnippet = {
	title: string;
	customUrl: string;
	thumbnails: {
		high: {
			url: string;
			width: number;
			height: number;
		};
	};
};

// ref: https://developers.google.com/youtube/v3/docs/channels/list
export async function fetchChannels(channelIds: string[]): Promise<YouTubeChannel[]> {
	const response = await ytFetch<YouTubeChannelList>('/channels', {
		part: 'snippet',
		ids: channelIds
	});

	return response.items;
}
