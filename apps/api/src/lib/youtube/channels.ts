import { youtubeFetch } from './fetch.js';
import { db } from '../../db/sqlite.js';
import type { YouTubeChannel, YouTubeChannelList } from './types.js';

const TAG_DELIMITER = ',';

export function parseChannelTags(tags: string): string[] {
	if (tags.length === 0) {
		return [];
	}

	return tags.split(TAG_DELIMITER);
}

export function formatChannelTags(tags: string[]): string {
	return tags.join(TAG_DELIMITER);
}

export async function doesChannelExist(channelId: string, source: 'database' | 'youtube'): Promise<boolean> {
	if (source === 'youtube') {
		const url = new URL(`https://www.youtube.com/channel/${channelId}`);

		const response = await fetch(url.href, {
			method: 'HEAD',
		});

		return response.status === 200;
	}

	const result = await db.query.channels.findFirst({
		where: ({ id }, { eq }) => eq(id, channelId),
		columns: { id: true },
	});

	return result !== undefined;
}

// ref: https://developers.google.com/youtube/v3/docs/channels/list
export async function fetchChannels(channelIds: string[]): Promise<YouTubeChannel[]> {
	const response = await youtubeFetch<YouTubeChannelList>('/channels', {
		resources: ['snippet', 'brandingSettings'],
		ids: channelIds,
	});

	return response.items;
}
