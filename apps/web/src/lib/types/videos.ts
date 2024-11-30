import type { paths } from '$api';

export type Video =
	paths['/videos/{videoId}']['get']['responses']['200']['content']['application/json'];
