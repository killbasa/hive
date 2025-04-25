import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { Video } from '$lib/types/videos';
import type { Writable } from 'svelte/store';

const STORE_KEY = 'video';

export function getVideoContext(): Writable<Video | null> {
	return getContext<Writable<Video | null>>(STORE_KEY);
}

export function setVideoContext(video: Video | null): void {
	const ctx = getVideoContext();
	if (ctx === undefined) {
		throw new Error('No video context found');
	}

	ctx.set(video);
}

export function initVideoContext(video: Video | null = null): Writable<Video | null> {
	const store = writable<Video | null>(video);
	setContext(STORE_KEY, store);

	return store;
}
