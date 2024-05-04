import { client } from '$lib/client';
import { getNumberParam } from '$lib/navigation';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url, params }) => {
	const response = await client.GET('/videos', {
		fetch,
		params: {
			query: {
				type: ['stream'],
				downloadStatus: ['done'],
				channelId: params.channelId,
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
