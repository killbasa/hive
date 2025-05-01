import { client } from '$lib/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const response = await client.GET('/videos/{videoId}', {
		fetch,
		params: {
			path: { videoId: params.videoId },
		},
	});

	// TODO - Should be able to handle null for arbitrary streams that aren't in db, maybe?
	return response.data!;
};
