import { apiFetch } from '$lib/fetch';
import type { HiveSettings, VersionData } from '@hive/common';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const [versionRes, userRes, settingsRes] = await Promise.all([
		apiFetch<VersionData>('/version', { fetch, method: 'GET' }),
		apiFetch<{ name: string }>('/users', { fetch, method: 'GET' }),
		apiFetch<HiveSettings>('/settings', { fetch, method: 'GET' })
	]);

	const [version, user, settings] = await Promise.all([
		versionRes.json(), //
		userRes.json(),
		settingsRes.json()
	]);

	return {
		version,
		user,
		settings
	};
};
