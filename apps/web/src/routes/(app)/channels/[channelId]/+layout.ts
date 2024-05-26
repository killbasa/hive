import { client } from '$lib/client';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, params }) => {
	const [response, stats] = await Promise.all([
		client.GET('/channels/{channelId}', {
			fetch,
			params: {
				path: { channelId: params.channelId },
			},
		}),
		client.GET('/channels/{channelId}/stats', {
			fetch,
			params: {
				path: { channelId: params.channelId },
			},
		}),
	]);

	if (response.data === undefined || stats.data === undefined) {
		error(404, 'Channel not found');
	}

	return {
		channel: response.data,
		stats: stats.data,
	};
};
