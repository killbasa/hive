import { client } from '$lib/client';
import { getNumberParam } from '$lib/navigation';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends, url }) => {
	depends('state:channels');

	const response = await client.GET('/channels', {
		fetch,
		params: {
			query: {
				page: getNumberParam(url, 'page', 1),
			},
		},
	});

	return {
		channels: response.data?.channels ?? [],
		total: response.data?.total ?? 0,
	};
};
