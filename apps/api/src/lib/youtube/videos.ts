import { youtubeFetch } from './fetch.js';

export type YouTubeVideoList = {
	items: YouTubeVideo[];
};

export type YouTubeVideo = {
	id: string;
	snippet: YouTubeVideoSnippet;
	liveStreamingDetails?: YouTubeLiveStreamingDetails;
};

export type YouTubeVideoSnippet = {
	publishedAt: string;
	channelId: string;
	title: string;
	description: string;
};

export type YouTubeLiveStreamingDetails = {
	actualStartTime?: string;
	actualEndTime?: string;
	scheduledStartTime: string;
};

// ref: https://developers.google.com/youtube/v3/docs/videos/list
export async function fetchVideos(videoIds: string[]): Promise<YouTubeVideo[]> {
	const response = await youtubeFetch<YouTubeVideoList>('/videos', {
		resources: ['snippet', 'liveStreamingDetails'],
		ids: videoIds,
	});

	return response.items;
}
