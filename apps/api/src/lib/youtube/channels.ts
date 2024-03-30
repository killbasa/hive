import { ytFetch } from './fetch';
import { db } from '../../db/client';
import type { YouTubeChannel, YouTubeChannelList } from './types';

export function parseTags(tags: string): string[] {
	return tags.split(',');
}

export function formatTags(tags: string[]): string {
	return tags.join(',');
}

export async function doesChannelExist(channelId: string, source: 'database' | 'youtube'): Promise<boolean> {
	if (source === 'youtube') {
		const url = new URL(`https://www.youtube.com/channel/${channelId}`);

		const response = await fetch(url.href, {
			method: 'HEAD'
		});

		return response.status === 200;
	}

	const result = await db.query.channels.findFirst({
		where: ({ id }, { eq }) => eq(id, channelId),
		columns: { id: true }
	});

	return result !== undefined;
}

// ref: https://developers.google.com/youtube/v3/docs/channels/list
export async function fetchChannels(channelIds: string[]): Promise<YouTubeChannel[]> {
	const response = await ytFetch<YouTubeChannelList>('/channels', {
		resources: ['snippet', 'brandingSettings'],
		ids: channelIds
	});

	return response.items;
}
