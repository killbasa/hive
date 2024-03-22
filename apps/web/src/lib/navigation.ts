import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';

export async function updatePage(updater: (params: URLSearchParams) => void): Promise<void> {
	const { url } = get(page);
	const params = new URLSearchParams(url.searchParams);

	updater(params);

	await goto(`?${params}`, {
		replaceState: true
	});
}
