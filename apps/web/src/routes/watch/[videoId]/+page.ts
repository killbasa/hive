import { apiFetch } from '$lib/api';
import type { Video } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const response = await apiFetch<Video<true>>(`/videos/${params.videoId}`, { fetch });

	return await response.json();
};
