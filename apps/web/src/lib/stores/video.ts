import type { VideoWithComments } from '$lib/types/videos';
import { getContext, setContext } from 'svelte';
import { type Writable, writable } from 'svelte/store';

const STORE_KEY = 'video';
type VideoContext = VideoWithComments | null;

export function getVideoContext(): Writable<VideoContext> {
	return getContext<Writable<VideoContext>>(STORE_KEY);
}

export function setVideoContext(video: VideoContext): void {
	const ctx = getVideoContext();
	if (ctx === undefined) {
		throw new Error('No video context found');
	}

	ctx.set(video);
}

export function initVideoContext(video: VideoContext = null): Writable<VideoContext> {
	const store = writable<VideoContext>(video);
	setContext(STORE_KEY, store);

	return store;
}
