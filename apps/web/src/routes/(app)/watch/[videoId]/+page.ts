import { client } from '$lib/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const response = await client.GET('/videos/{videoId}', {
		fetch,
		params: {
			path: { videoId: params.videoId }
		}
	});

	return response.data!;
};
