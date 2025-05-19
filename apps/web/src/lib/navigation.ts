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

export function getStringParam<T extends string>(
	url: URL,
	key: string,
	valid?: Record<string, T> | T[] | undefined,
	fallback?: T | undefined,
): T | undefined {
	const value = url.searchParams.get(key) as T | null;
	if (value === null) {
		return fallback;
	}

	if (!valid) {
		return value;
	}

	if (Array.isArray(valid)) {
		return valid.includes(value) ? value : undefined;
	}

	return Object.values(valid).includes(value) ? value : undefined;
}

export function getPaginationPages(page: number, lastPage: number): (number | null)[] {
	if (lastPage < 6) {
		return Array.from({ length: lastPage }, (_, i) => i + 1);
	}

	if (page < 4) {
		return [1, 2, 3, 4, null, lastPage];
	}

	if (page > lastPage - 3) {
		return [1, null, lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
	}

	return [1, null, page - 1, page, page + 1, null, lastPage];
}
