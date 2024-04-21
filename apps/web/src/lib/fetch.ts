import { config } from './config';

type RequestOptions = Omit<RequestInit, 'credentials'> & {
	fetch: typeof window.fetch;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	searchParams?: Record<string, string | number | boolean | undefined | null | string[]>;
};

export async function apiFetch<T>(
	path: string,
	options: RequestOptions
): Promise<{
	raw: Response;
	json: () => Promise<T>;
	error: () => Promise<{ message: string }>;
}> {
	const url = new URL(path, config.apiUrl);

	if (options.searchParams) {
		for (const [key, value] of Object.entries(options.searchParams)) {
			if (value === null || value === undefined) continue;
			url.searchParams.append(key, value.toString());
		}
	}

	const request: RequestInit = options;
	request.credentials = 'include';

	const response = await options.fetch(url.href, request);

	return {
		raw: response,
		json: async () => (await response.json()) as Promise<T>,
		error: async () => await response.json().catch(() => ({ message: 'Something went wrong' }))
	};
}
