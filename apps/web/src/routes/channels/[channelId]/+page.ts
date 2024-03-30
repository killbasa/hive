import { apiFetch } from '$lib/api';
import type { Channel, Video } from '$lib/types';
import { getNumberParam } from '$lib/url';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, url }) => {
	const page = getNumberParam(url, 'page', 1);

	const [channelRes, videoRes] = await Promise.all([
		apiFetch<Channel>(`/channels/${params.channelId}`, {
			fetch
		}),
		apiFetch<{ videos: Video[]; total: number }>(`/videos?status=done&page=${page}`, {
			fetch
		})
	]);

	if (channelRes.raw.status === 404) {
		error(404, 'Channel not found');
	}

	const [channel, videos] = await Promise.all([
		channelRes.json(), //
		videoRes.json()
	]);

	return {
		channel,
		videos: videos.videos,
		totalVideos: videos.total
	};
};
