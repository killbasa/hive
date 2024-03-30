import { apiFetch } from '$lib/api';
import type { Channel } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends }) => {
	depends('state:channels');

	const response = await apiFetch<{ channels: Channel[] }>('/channels', { fetch });
	return await response.json();
};
