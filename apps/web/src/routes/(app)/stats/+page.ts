import { apiFetch } from '$lib/fetch';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await apiFetch<{
		channels: number;
		videos: number;
		comments: number;
		scanQueue: number;
		downloadQueue: number;
	}>('/stats', { fetch });

	return await response.json();
};
