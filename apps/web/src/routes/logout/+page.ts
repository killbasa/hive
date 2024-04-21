import { apiFetch } from '$lib/fetch';
import type { PageLoad } from './$types';
import { goto } from '$app/navigation';

export const load: PageLoad = async ({ fetch }) => {
	await apiFetch('/auth/logout', {
		fetch,
		method: 'POST'
	});

	await goto('/login');
};
