import { apiFetch } from '$lib/fetch';
import { getNumberParam, getStringParam } from '$lib/navigation';
import type { Video } from '$lib/types/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends, url }) => {
	depends('state:downloads');

	const page = getNumberParam(url, 'page', 1);
	const search = getStringParam(url, 'search');

	const [pendingVideos] = await Promise.all([
		apiFetch<{ videos: Video[]; total: number }>('/videos', {
			fetch,
			searhParams: {
				status: 'pending',
				search,
				page
			}
		})
	]);

	const [videos] = await Promise.all([
		pendingVideos.json() //
	]);

	return {
		videos: videos.videos,
		total: videos.total
	};
};
