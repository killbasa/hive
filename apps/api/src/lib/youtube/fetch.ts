import { server } from '../../server.js';
import { isTesting } from '../constants.js';

const YT_BASE_URL = 'https://www.googleapis.com/youtube';
const YT_API_VERSION = 'v3';

export async function ytFetch<T>(
	path: string,
	options: {
		resources?: string[];
		ids?: string[];
	},
): Promise<T> {
	if (isTesting) {
		throw new Error('ytFetch should not be called in testing');
	}

	const url = new URL(`${YT_BASE_URL}/${YT_API_VERSION}${path}`);
	url.searchParams.set('key', server.config.YT_API_KEY);

	if (options.resources) {
		url.searchParams.set('part', options.resources.join(','));
	}

	if (options.ids) {
		url.searchParams.set('id', options.ids.join(','));
	}

	const response = await fetch(url.href, {
		method: 'GET',
	});

	return (await response.json()) as T;
}
