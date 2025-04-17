import { client } from '$lib/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends }) => {
	depends('state:settings');

	const [version, user, settings] = await Promise.all([
		client.GET('/version', { fetch }),
		client.GET('/users/me', { fetch }),
		client.GET('/settings/', { fetch }),
	]);

	return {
		version: version.data!,
		user: user.data!,
		settings: settings.data!,
	};
};
