<script lang="ts">
	import { client } from '$lib/client';
	import { config } from '$lib/config';
	import { getVideoContext } from '$lib/stores/video';
	import { Time, throttle, debounce } from '@hive/common';
	import { onMount } from 'svelte';
	import type { EventHandler } from 'svelte/elements';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { base } from '$app/paths';

	const video = getVideoContext();

	let element = $state<HTMLVideoElement | null>(null);
	let divElement: HTMLDivElement;
	let ready = $state(false);

	let currentTime = $state(0);
	let isWatchPage = $derived(page.url.pathname.startsWith(`${base}/watch`));

	const onVolumeChange: EventHandler<Event, HTMLVideoElement> = () => {
		if (!element) return;

		localStorage.setItem('videoVolume', element.volume.toString());
	};

	const loadPlayer: EventHandler<Event, HTMLVideoElement> = () => {
		if (!$video || !element) return;

		setTime(page.url.searchParams.get('t') ?? $video.watchProgress);

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
		if (!$video || $video.type === 'short') return;

		await client.PATCH('/videos/{videoId}', {
			params: { path: { videoId: $video.id } },
			body: {
				watchProgress: time,
				watchCompleted: $video.duration ? time / $video.duration > 0.9 : false,
			},
		});
	}

	function closeVideo(): void {
		video.set(null);
		unmountVideo();
	}

	function mountVideo(): void {
		if (!element) return;

		if (isWatchPage) {
			// Add video to watch page
			const watchPageElement = document.getElementById('video-element');

			if (watchPageElement && !watchPageElement.hasChildNodes()) {
				watchPageElement.appendChild(element);
			}
		} else if (!divElement.hasChildNodes()) {
			// Show corner player
			divElement.appendChild(element);
		}
	}

	function unmountVideo(): void {
		if (!element) return;

		// Remove corner player
		if (!isWatchPage && divElement.hasChildNodes()) {
			divElement.removeChild(element);
		}
	}

	afterNavigate((data) => {
		if (!data.from || data.willUnload) return;

		// Close video if it's a short or the video is paused
		if (!isWatchPage && (element?.paused || $video?.type === 'short')) {
			return closeVideo();
		}

		mountVideo();
	});

	if (import.meta.hot) {
		// Mount video if it was unmounted due to HMR
		onMount(() => {
			mountVideo();
		});
	}
</script>

<div
	class="flex flex-col rounded-lg overflow-hidden {$video && isWatchPage //
		? 'w-full'
		: 'fixed bottom-2 right-2 w-[400px]'}"
>
	{#if $video}
		{#if !isWatchPage}
			<div class="p-1 bg-slate-800 justify-end flex gap-1">
				<a href="{base}/watch/{$video.id}" title="Expand video">Max</a>
				<button onclick={closeVideo} title="Close video">X</button>
			</div>
			<progress
				class="progress-primary h-2"
				value={Math.floor(currentTime)}
				max={$video.duration}
			></progress>
		{/if}
	{/if}
	<div bind:this={divElement}></div>
</div>

{#if $video}
	{#key $video.id}
		<video
			id={Date.now().toString()}
			poster="{config.assetsPath}/{$video.channelId}/videos/{$video.id}/thumbnail.png"
			onvolumechange={onVolumeChange}
			onloadstart={loadPlayer}
			ontimeupdate={onTimeUpdate}
			onended={onTimeUpdate}
			controls
			playsinline
			style={$video.type === 'short' ? 'width: 450px;' : 'width: 100%;'}
			bind:this={element}
		>
			<source
				src="{config.assetsPath}/{$video.channelId}/videos/{$video.id}/video.mp4"
				type="video/mp4"
			/>
			<track kind="captions" />
		</video>
	{/key}
{/if}

<style lang="postcss">
	progress {
		--rounded-box: 0;
	}
</style>
