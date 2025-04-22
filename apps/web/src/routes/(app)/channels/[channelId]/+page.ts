import { client } from '$lib/client';
import { getNumberParam, getStringParam } from '$lib/navigation';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url, params }) => {
	const response = await client.GET('/videos/', {
		fetch,
		params: {
			query: {
				type: ['video'],
				downloadStatus: ['done'],
				channelId: params.channelId,
				search: getStringParam(url, 'search'),
				page: getNumberParam(url, 'page', 1),
			},
		},
	});

	return {
		videos: response.data?.videos ?? [],
		total: response.data?.total ?? 0,
	};
};
