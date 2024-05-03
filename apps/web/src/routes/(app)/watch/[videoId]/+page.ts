import { apiFetch } from '$lib/fetch';
import type { VideoWithComments } from '@hive/common';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const response = await apiFetch<VideoWithComments>(`/videos/${params.videoId}`, {
		fetch,
		method: 'GET'
	});

	return await response.json();
};
