import { config } from './config';
import type { FetchFunction } from './types';

export async function apiFetch<T>(
	path: string,
	options: RequestInit & { fetch: FetchFunction }
): Promise<{ raw: Response; json: () => Promise<T> }> {
	const url = new URL(path, `http://${config.apiUrl}`);

	const headers: HeadersInit = options?.headers ?? {};
	if (options?.body) {
		// @ts-expect-error asd
		headers['Content-Type'] = 'application/json';
	}

	const response = await options.fetch(url.href, {
		...options,
		headers
	});

	return {
		raw: response,
		json: async () => (await response.json()) as Promise<T>
	};
}
