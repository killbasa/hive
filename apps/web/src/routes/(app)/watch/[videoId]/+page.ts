import { client } from '$lib/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const response = await client.GET('/videos/{videoId}', {
		fetch,
		params: {
			path: { videoId: params.videoId },
		},
	});

	const video = response.data!;

	const channel = await client.GET('/channels/{channelId}', {
		fetch,
		params: {
			path: { channelId: video.channelId },
		},
	});

	// TODO - Should be able to handle null for arbitrary streams that aren't in db, maybe?
	return {
		video,
		channel: channel.data!,
	};
};
