import { client } from '$lib/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const [version, user, settings] = await Promise.all([
		client.GET('/version', { fetch }),
		client.GET('/users', { fetch }),
		client.GET('/settings', { fetch }),
	]);

	return {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		version: version.data!,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		user: user.data!,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		settings: settings.data!,
	};
};
