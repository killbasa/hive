import { apiFetch } from '$lib/api';
import type { VersionData } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await apiFetch<VersionData>(`/version`, { fetch });
	return await response.json();
};
