import { goto } from '$app/navigation';
import { page } from '$app/state';

export async function updatePage(
	updater: (params: URLSearchParams) => void,
	options?: Parameters<typeof goto>[1],
): Promise<void> {
	const params = new URLSearchParams(page.url.searchParams);

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

export function getStringParam(
	url: URL,
	key: string,
	valid?: Record<string, string> | string[],
): string | undefined {
	const value = url.searchParams.get(key);
	if (value === null) {
		return undefined;
	}

	if (!valid) {
		return value;
	}

	if (Array.isArray(valid)) {
		return valid.includes(value) ? value : undefined;
	}

	return Object.values(valid).includes(value) ? value : undefined;
}
