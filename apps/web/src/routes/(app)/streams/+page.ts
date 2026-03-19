import { client } from '$lib/client';
import { getNumberParam } from '$lib/navigation';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
	const response = await client.GET('/videos/', {
		fetch,
		params: {
			query: {
				status: ['upcoming', 'live'],
				type: ['stream'],
				page: getNumberParam(url, 'page', 1),
			},
		},
	});

	return {
		videos: response.data?.videos ?? [],
		total: response.data?.total ?? 0,
	};
};
