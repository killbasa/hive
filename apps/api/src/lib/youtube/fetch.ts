import { config } from '../config';

const YT_BASE_URL = 'https://www.googleapis.com/youtube';
const YT_API_VERSION = 'v3';

export async function ytFetch<T>(
	path: string,
	options: {
		part?: string;
		ids?: string[];
	}
): Promise<T> {
	const url = new URL(`${YT_BASE_URL}/${YT_API_VERSION}${path}`);
	url.searchParams.set('key', config.YT_API_KEY);

	if (options.part) url.searchParams.set('part', options.part);
	if (options.ids) url.searchParams.set('id', options.ids.join(','));

	const response = await fetch(url.href, {
		method: 'GET'
	});

	return await response.json();
}
