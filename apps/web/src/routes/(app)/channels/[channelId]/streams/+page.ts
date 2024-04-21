import { apiFetch } from '$lib/fetch';
import { getNumberParam, getStringParam } from '$lib/navigation';
import type { Video } from '@hive/common';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url, params }) => {
	const page = getNumberParam(url, 'page', 1);
	const search = getStringParam(url, 'search');

	const response = await apiFetch<{ videos: Video[]; total: number }>('/videos', {
		fetch,
		method: 'GET',
		searchParams: {
			type: ['stream'],
			downloadStatus: ['done'],
			channelId: params.channelId,
			search,
			page
		}
	});

	const data = await response.json();

	return {
		videos: data.videos,
		total: data.total
	};
};
