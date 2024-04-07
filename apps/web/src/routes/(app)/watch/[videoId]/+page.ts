import { apiFetch } from '$lib/fetch';
import type { Video } from '@hive/common';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const response = await apiFetch<Video<true>>(`/videos/${params.videoId}`, { fetch });

	return await response.json();
};
