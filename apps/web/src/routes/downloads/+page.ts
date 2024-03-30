import { apiFetch } from '$lib/api';
import type { DownloaderVideoTask, Video } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends }) => {
	depends('state:downloads');

	const [pendingVideos, currentDownload] = await Promise.all([
		apiFetch<{ videos: Video[]; total: number }>('/videos?status=pending', {
			fetch
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
