<script lang="ts">
	import { client } from '$lib/client';
	import { config } from '$lib/config';
	import { getVideoContext } from '$lib/stores/video';
	import { Time, throttle, debounce } from '@hive/common';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';

	const video = getVideoContext();

	let element: HTMLVideoElement;
	let divElement: HTMLDivElement;
	let ready = false;
	let hide = false;

	$: currentTime = 0;
	$: isWatchPage = $page.url.pathname.startsWith('/watch');

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

		setTime($page.url.searchParams.get('t') ?? $video.watchProgress);

		const local = localStorage.getItem('videoVolume') ?? '1';
		const parsedVol = Number.parseFloat(local);
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

	function setTime(value: string | number | null): void {
		if (value === null || !element) return;
		if (typeof value === 'string') {
			value = Number(value);
		}

		if (Number.isNaN(value)) return;

		currentTime = Number(value);
		element.currentTime = currentTime;
	}

	const debounceUpdate = debounce(postUpdate, Time.Second);
	const throttleUpdate = throttle(postUpdate, Time.Second * 2);

	async function postUpdate(time: number) {
		if (!$video) return;

		await client.PATCH('/videos/{videoId}', {
			params: { path: { videoId: $video.id } },
			body: {
				watchProgress: time,
				watchCompleted: $video.duration ? time / $video.duration > 0.9 : false,
			},
		});
	}

	function closeVideo() {
		video.set(null);
	}

	function minimizeVideo() {
		hide = !hide;
	}

	function mountVideo() {
		if (isWatchPage) {
			const watchPageElement = document.getElementById('video-element');

			if (watchPageElement && !watchPageElement.hasChildNodes()) {
				watchPageElement.appendChild(element);
			}
		} else if (element && !divElement.hasChildNodes()) {
			divElement.appendChild(element);
		}
	}

	afterNavigate((data) => {
		if (data.from === null) return;

		if (!isWatchPage && (element?.paused || $video?.type === 'short')) {
			closeVideo();
		}

		mountVideo();
		setTime($page.url.searchParams.get('t'));
	});

	if (import.meta.hot) {
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
			<div class="p-1 bg-slate-800">
				<button class="btn btn-sm btn-tertiary" on:click={closeVideo}>Close</button>
				<a role="button" class="btn btn-sm btn-tertiary" href="/watch/{$video.id}">Expand</a
				>
				<button class="btn btn-sm btn-tertiary" on:click={minimizeVideo}>Collapse</button>
			</div>
			<progress
				class="progress-primary h-2"
				value={Math.floor(currentTime)}
				max={$video.duration}
			/>
		{/if}
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
			on:ended={onTimeUpdate}
			controls
			playsinline
			style={$video.type === 'short' ? 'width: 450px;' : 'width: 100%;'}
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
