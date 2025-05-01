import { client } from '$lib/client';
import { getNumberParam, getStringParam } from '$lib/navigation';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends, url }) => {
	depends('state:downloads');

	type T = 'ignored' | 'pending' | 'done';
	const status: T[] = [
		(getStringParam(url, 'status', ['ignored', 'pending', 'done']) as T | undefined) ??
			'pending',
	];

	const response = await client.GET('/videos/', {
		fetch,
		params: {
			query: {
				status: ['none', 'past'],
				type: ['video', 'short', 'stream'],
				downloadStatus: status,
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
