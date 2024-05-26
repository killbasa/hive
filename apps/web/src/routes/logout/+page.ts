import { client } from '$lib/client';
import type { PageLoad } from './$types';
import { goto } from '$app/navigation';

export const load: PageLoad = async ({ fetch }) => {
	await client.POST('/auth/logout', {
		fetch,
		headers: { 'Content-Type': null },
	});

	await goto('/login');
};
