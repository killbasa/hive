import { apiFetch } from '$lib/api';
import type { Video } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await apiFetch<{ videos: Video[] }>('/videos?status=pending', { fetch });
	return await response.json();
};
