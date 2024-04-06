import { apiFetch } from '$lib/fetch';
import type { Video } from '$lib/types/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const videos = await apiFetch<{ videos: Video[] }>('/videos', {
		fetch,
		searhParams: {
			status: 'done',
			inProgress: true
		}
	});

	const data = await videos.json();

	return {
		videos: data.videos
	};
};
