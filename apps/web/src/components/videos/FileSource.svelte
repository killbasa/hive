<script lang="ts">
	import { client } from '$lib/client';
	import { config } from '$lib/config';
	import { Time, throttle, debounce } from '@hive/common';
	import type { EventHandler } from 'svelte/elements';
	import { page } from '$app/state';
	import type { Video } from '$lib/types/videos';

	let {
		video = $bindable(),
		element = $bindable(null),
		class: cls = '',
	}: {
		video: Video;
		element: HTMLVideoElement | null;
		class?: string;
	} = $props();

	let ready = $state(false);

	let currentTime = $state(0);

	const onVolumeChange: EventHandler<Event, HTMLVideoElement> = () => {
		if (!element) return;

		localStorage.setItem('videoVolume', element.volume.toString());
	};

	const loadPlayer: EventHandler<Event, HTMLVideoElement> = () => {
		if (!video || !element) return;

		setTime(page.url.searchParams.get('t') ?? video.watchProgress);

		const local = localStorage.getItem('videoVolume') ?? '1';
		const parsedVol = Number.parseFloat(local);
		element.volume = Number.isNaN(parsedVol) ? 1 : parsedVol;

		window.setTimeout(() => {
			ready = true;
		}, 500);
	};

	const onTimeUpdate: EventHandler<Event, HTMLVideoElement> = async () => {
		if (!ready || !element) return;

		currentTime = element.currentTime;

		if (element.paused) {
			await debounceUpdate(currentTime);
		} else {
			await throttleUpdate(currentTime);
		}
	};

	function setTime(value: string | number | null): void {
		if (value === null || !element) return;
		if (typeof value === 'string') {
			value = Number.parseInt(value);
		}

		if (Number.isNaN(value)) return;

		currentTime = value;
		element.currentTime = currentTime;
	}

	const debounceUpdate = debounce(postUpdate, Time.Second);
	const throttleUpdate = throttle(postUpdate, Time.Second * 2);

	async function postUpdate(time: number) {
		// Don't need to save progress if it's a short
		if (!video || video.type === 'short') return;

		await client.PATCH('/videos/{videoId}', {
			params: { path: { videoId: video.id } },
			body: {
				watchProgress: time,
				watchCompleted: video.duration ? time / video.duration > 0.9 : false,
			},
		});
	}
</script>

<video
	id="video-player"
	poster="{config.assetsPath}/{video.channelId}/videos/{video.id}/thumbnail.png"
	onvolumechange={onVolumeChange}
	onloadstart={loadPlayer}
	ontimeupdate={onTimeUpdate}
	onended={onTimeUpdate}
	controls
	playsinline
	title={video.title}
	style={video.type === 'short' ? 'width: 450px;' : 'width: 100%; aspect-ratio: 16/9;'}
	class={cls}
	bind:this={element}
>
	<source
		src="{config.assetsPath}/{video.channelId}/videos/{video.id}/video.mp4"
		type="video/mp4"
	/>
	<track kind="captions" />
</video>
