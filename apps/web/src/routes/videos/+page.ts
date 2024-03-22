import { apiFetch } from '$lib/api';
import type { Video } from '$lib/types';
import { getNumberParam } from '$lib/url';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
	const page = getNumberParam(url, 'page', 1);

	const response = await apiFetch<{ videos: Video[] }>(`/videos?status=done&page=${page}`, {
		fetch
	});
	return await response.json();
};
