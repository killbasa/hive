import { apiFetch } from '$lib/fetch';
import { getNumberParam } from '$lib/navigation';
import type { Channel } from '$lib/types/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends, url }) => {
	depends('state:channels');

	const page = getNumberParam(url, 'page', 1);

	const response = await apiFetch<{ channels: Channel[]; total: number }>('/channels', {
		fetch,
		searhParams: { page }
	});

	const data = await response.json();

	return {
		channels: data.channels,
		totalChannels: data.total
	};
};
