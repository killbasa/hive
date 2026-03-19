import { client } from '$lib/client';
import { getNumberParam, getStringParam } from '$lib/navigation';
import type { Video } from '$lib/types/videos';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends, url }) => {
	depends('state:downloads');

	const status = getStringParam<Video['downloadStatus']>(url, 'status', [
		'ignored',
		'pending',
		'done',
	]);

	const response = await client.GET('/videos/', {
		fetch,
		params: {
			query: {
				status: ['none', 'past'],
				type: ['video', 'short', 'stream'],
				downloadStatus: status ? [status] : undefined,
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
