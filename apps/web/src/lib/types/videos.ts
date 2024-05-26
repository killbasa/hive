import type { paths } from '$api';

export type VideoWithComments =
	paths['/videos/{videoId}']['get']['responses']['200']['content']['application/json'];

export type Video = Omit<VideoWithComments, 'comments'>;
