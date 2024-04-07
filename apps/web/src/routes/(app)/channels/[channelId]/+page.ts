import { apiFetch } from '$lib/fetch';
import { getNumberParam, getStringParam } from '$lib/navigation';
import type { Video } from '@hive/common';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url, params }) => {
	const page = getNumberParam(url, 'page', 1);
	const search = getStringParam(url, 'search');

	const videos = await apiFetch<{ videos: Video[]; total: number }>('/videos', {
		fetch,
		searhParams: {
			status: 'done',
			channelId: params.channelId,
			search,
			page
		}
	});

	const data = await videos.json();

	return {
		videos: data.videos,
		totalVideos: data.total
	};
};
