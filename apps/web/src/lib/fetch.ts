import { config } from './config';

export async function apiFetch<T>(
	path: string,
	options: RequestInit & {
		fetch: typeof window.fetch;
		searhParams?: Record<string, string | number | boolean | undefined | null>;
	}
): Promise<{
	raw: Response;
	json: () => Promise<T>;
	error: () => Promise<{ message: string }>;
}> {
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
		json: async () => (await response.json()) as Promise<T>,
		error: async () => await response.json().catch(() => ({ message: 'Something went wrong' }))
	};
}
