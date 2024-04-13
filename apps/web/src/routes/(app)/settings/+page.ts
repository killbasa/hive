import { apiFetch } from '$lib/fetch';
import type { HiveSettings, VersionData } from '@hive/common';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const [versionRes, userRes, settingsRes] = await Promise.all([
		apiFetch<VersionData>('/version', { fetch }),
		apiFetch<{ username: string }>('/users', { fetch }),
		apiFetch<HiveSettings>('/settings', { fetch })
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
