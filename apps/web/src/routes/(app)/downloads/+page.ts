import { apiFetch } from '$lib/fetch';
import { getNumberParam, getStringParam } from '$lib/navigation';
import type { Video } from '$lib/types/api';
import type { DownloaderVideoTask } from '$lib/types/ws';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends, url }) => {
	depends('state:downloads');

	const page = getNumberParam(url, 'page', 1);
	const search = getStringParam(url, 'search');

	const [pendingVideos, currentDownload] = await Promise.all([
		apiFetch<{ videos: Video[]; total: number }>('/videos', {
			fetch,
			searhParams: {
				status: 'pending',
				search,
				page
			}
		}),
		apiFetch<{ current: DownloaderVideoTask }>('/downloads/current', {
			fetch
		})
	]);

	const [videos, download] = await Promise.all([
		pendingVideos.json(), //
		currentDownload.json()
	]);

	return {
		videos: videos.videos,
		total: videos.total,
		download: download.current
	};
};
