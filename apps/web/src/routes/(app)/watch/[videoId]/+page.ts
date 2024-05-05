import { client } from '$lib/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const response = await client.GET('/videos/{videoId}', {
		fetch,
		params: {
			path: { videoId: params.videoId },
		},
	});

	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	return response.data!;
};
