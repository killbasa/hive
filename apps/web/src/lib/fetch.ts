import { config } from './config';
import type { FetchFunction } from './types/generic';

export async function apiFetch<T>(
	path: string,
	options: RequestInit & {
		fetch: FetchFunction;
		searhParams?: Record<string, string | number | boolean | undefined | null>;
	}
): Promise<{ raw: Response; json: () => Promise<T> }> {
	const url = new URL(path, config.apiUrl);

	if (options.searhParams) {
		for (const [key, value] of Object.entries(options.searhParams)) {
			if (value === null || value === undefined) continue;
			url.searchParams.append(key, value.toString());
		}
	}

	const response = await options.fetch(url.href, {
		...options,
		credentials: 'include'
	});

	return {
		raw: response,
		json: async () => (await response.json()) as Promise<T>
	};
}
