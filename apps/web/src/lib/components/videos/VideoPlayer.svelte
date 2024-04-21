<script lang="ts">
	import { apiFetch } from '$lib/fetch';
	import { config } from '$lib/config';
	import { MIMETypes } from '$lib/constants';
	import { debounce, throttle } from '$lib/utils';
	import { getVideoContext } from '$lib/stores/video';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { Time } from '@hive/common';
	import { onMount } from 'svelte';

	let element: HTMLVideoElement;
	let divElement: HTMLDivElement;
	let ready = false;
	let hide = false;

	$: currentTime = 0;
	$: isWatchPage = $page.url.pathname.startsWith('/watch');

	const video = getVideoContext();

	video.subscribe((data) => {
		hide = data === null;

		if (data !== null) {
			localStorage.setItem('currentVideo', data.id);
		}
	});

	function onVolumeChange() {
		localStorage.setItem('videoVolume', element.volume.toString());
	}

	function loadPlayer(): void {
		if (!$video) return;

		const parsedTime = parseFloat($video.watchProgress);
		currentTime = isNaN(parsedTime) ? 0 : parsedTime;
		element.currentTime = currentTime;

		const local = localStorage.getItem('videoVolume') ?? '1';
		const parsedVol = parseFloat(local);
		element.volume = isNaN(parsedVol) ? 1 : parsedVol;

		window.setTimeout(() => {
			ready = true;
		}, 500);
	}

	async function onTimeUpdate() {
		if (!ready) return;

		currentTime = element.currentTime;

		if (element.paused) {
			await debounceUpdate(currentTime);
		} else {
			await throttleUpdate(currentTime);
		}
	}

	const debounceUpdate = debounce(postUpdate, Time.Second);
	const throttleUpdate = throttle(postUpdate, Time.Second * 2);

	async function postUpdate(time: number) {
		if (!$video) return;

		await apiFetch(`/videos/${$video.id}/progress`, {
			fetch,
			method: 'POST',
			headers: { 'content-type': MIMETypes.json },
			body: JSON.stringify({ progress: time })
		});
	}

	function closeVideo() {
		video.set(null);
	}

	function minimizeVideo() {
		hide = !hide;
	}

	function mountVideo() {
		const watchPageElement = document.getElementById('video-element');

		if (isWatchPage && watchPageElement && !watchPageElement.hasChildNodes()) {
			watchPageElement.appendChild(element);
		} else if (!isWatchPage && element && !divElement.hasChildNodes()) {
			divElement.appendChild(element);
		}
	}

	afterNavigate((data) => {
		if (data.from === null) return;

		mountVideo();
	});

	if (import.meta.hot) {
		onMount(() => {
			mountVideo();
		});
	}
</script>

<div
	class="flex flex-col rounded-lg overflow-hidden {$video && isWatchPage
		? 'w-full'
		: 'fixed bottom-2 right-2 w-[400px]'}"
>
	{#if $video}
		{#if !isWatchPage}
			<div class="p-1 bg-slate-800">
				<button class="btn btn-sm btn-tertiary" on:click={closeVideo}>Close</button>
				<a role="button" class="btn btn-sm btn-tertiary" href="/watch/{$video.id}">Expand</a
				>
				<button class="btn btn-sm btn-tertiary" on:click={minimizeVideo}>Collapse</button>
			</div>
		{/if}
		<progress
			class="progress-primary h-2"
			value={Math.floor(currentTime)}
			max={$video.duration}
		/>
	{/if}
	<div bind:this={divElement}></div>
</div>

{#if $video}
	{#key $video.id}
		<video
			id={Date.now().toString()}
			poster="{config.apiUrl}/assets/{$video.channelId}/videos/{$video.id}/thumbnail.png"
			on:volumechange={onVolumeChange}
			on:loadstart={loadPlayer}
			on:timeupdate={onTimeUpdate}
			controls
			playsinline
			width="100%"
			hidden={hide}
			bind:this={element}
		>
			<source
				src="{config.apiUrl}/assets/{$video.channelId}/videos/{$video.id}/video.mp4"
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
