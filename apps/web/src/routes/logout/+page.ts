import { goto } from '$app/navigation';
import { client } from '$lib/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	await client.POST('/auth/logout', {
		fetch,
	});

	await goto('/login');
};
