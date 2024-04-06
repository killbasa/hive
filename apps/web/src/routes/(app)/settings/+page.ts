import { apiFetch } from '$lib/fetch';
import type { VersionData } from '$lib/types/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const [versionRes, userRes] = await Promise.all([
		apiFetch<VersionData>('/version', { fetch }),
		apiFetch<{ username: string }>('/users', { fetch })
	]);

	const [version, user] = await Promise.all([
		versionRes.json(), //
		userRes.json()
	]);

	return {
		version,
		user
	};
};
