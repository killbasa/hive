import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';

export async function updatePage(
	updater: (params: URLSearchParams) => void,
	options?: Parameters<typeof goto>[1],
): Promise<void> {
	const { url } = get(page);
	const params = new URLSearchParams(url.searchParams);

	updater(params);

	await goto(`?${params}`, {
		replaceState: true,
		noScroll: false,
		...options,
	});
}

export function getNumberParam(url: URL, key: string, fallback = 1): number {
	const value = url.searchParams.get(key);
	if (value === null) {
		return fallback;
	}

	const coerce = Number.parseInt(value, 10);
	return Number.isNaN(coerce) ? fallback : coerce;
}

export function getStringParam(url: URL, key: string, valid?: string[]): string | undefined {
	const value = url.searchParams.get(key);
	if (value === null || !valid) {
		return undefined;
	}

	return valid.includes(value) ? value : undefined;
}
