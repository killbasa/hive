import { apiFetch } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await apiFetch<{ channels: number; videos: number; comments: number }>(
		'/stats',
		{ fetch }
	);

	return await response.json();
};
