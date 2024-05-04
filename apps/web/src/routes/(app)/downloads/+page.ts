import { getNumberParam } from '$lib/navigation';
import type { PageLoad } from './$types';
import { client } from '$lib/client';

export const load: PageLoad = async ({ fetch, depends, url }) => {
	depends('state:downloads');

	const response = await client.GET('/videos', {
		fetch,
		params: {
			query: {
				status: ['none', 'past'],
				type: ['video', 'short', 'stream'],
				downloadStatus: ['pending'],
				search: url.searchParams.get('search') ?? undefined,
				page: getNumberParam(url, 'page', 1)
			}
		}
	});

	return {
		videos: response.data?.videos ?? [],
		total: response.data?.total ?? 0
	};
};
