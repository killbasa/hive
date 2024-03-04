import { config } from './config';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<{ raw: Response; json: () => Promise<T> }> {
	const url = new URL(path, `http://${config.apiUrl}`);

	const headers: HeadersInit = options?.headers ?? {};
	if (options?.body) {
		// @ts-ignore
		headers['Content-Type'] = 'application/json';
	}

	const response = await fetch(url.href, {
		...options,
		headers
	});

	return {
		raw: response,
		json: async () => (await response.json()) as Promise<T>
	};
}
