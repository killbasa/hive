import { apiFetch } from '$lib/api';
import type { Channel } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const response = await apiFetch<Channel>(`/channels/${params.channelId}`, { fetch });
	return await response.json();
};
