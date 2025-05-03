<script lang="ts">
	import { getVideoContext } from '$lib/stores/video';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { base } from '$app/paths';
	import ExpandIcon from '@lucide/svelte/icons/expand';
	import XIcon from '@lucide/svelte/icons/x';
	import { logger } from '$lib/logger';
	import FileSource from './FileSource.svelte';
	import YoutubeSource from './YoutubeSource.svelte';

	const video = getVideoContext();

	// TODO - This probably needs to be handled properly
	let videoElement = $state<HTMLVideoElement | HTMLEmbedElement | null>(null);
	let miniplayerElement: HTMLDivElement;

	let currentTime = $state(0);
	let isWatchPage = $derived(page.url.pathname.startsWith(`${base}/watch`));
	let isLivestream = $derived<boolean>(
		$video?.type === 'stream' && ($video.status === 'live' || $video.status === 'upcoming'),
	);

	function closeVideo(): void {
		logger.debug('closing video');
		video.set(null);
		unmountVideo();
	}

	function mountVideo(): void {
		if (!videoElement) return;

		if (isWatchPage) {
			// Add video to watch page
			const watchPageElement = document.getElementById('video-element');

			if (watchPageElement && !watchPageElement.hasChildNodes()) {
				logger.debug('mounting video');
				watchPageElement.appendChild(videoElement);
			}
		} else if (!miniplayerElement.hasChildNodes()) {
			// Show mini player
			logger.debug('mounting mini video');
			miniplayerElement.appendChild(videoElement);
		}
	}

	function unmountVideo(): void {
		if (!videoElement) return;

		// Remove mini player
		if (!isWatchPage && miniplayerElement.hasChildNodes()) {
			logger.debug('unmounting video');
			miniplayerElement.removeChild(videoElement);
		}
	}

	afterNavigate((data) => {
		if (!data.from || data.willUnload) return;

		// Close video if it's a short or the video is paused
		if (!isWatchPage) {
			if (
				(videoElement && 'paused' in videoElement && videoElement?.paused) ||
				$video?.type === 'short'
			) {
				return closeVideo();
			}
		}

		mountVideo();
	});

	if (import.meta.hot) {
		// Mount video if it was unmounted due to HMR
		onMount(() => {
			logger.debug('mounting video on redload');

			const watchPageElement = document.getElementById('video-element');
			if (watchPageElement) watchPageElement.innerHTML = '';

			mountVideo();
		});
	}
</script>

<div
	class="flex flex-col rounded-lg overflow-hidden z-[9999] {$video && isWatchPage //
		? 'w-full'
		: 'fixed bottom-2 right-2 w-[400px]'}"
>
	{#if $video}
		{#if !isWatchPage}
			<div class="p-1 bg-slate-800 justify-end flex gap-1">
				<a href="{base}/watch/{$video.id}" title="Expand video">
					<ExpandIcon class="p-0.5" />
				</a>
				<button onclick={closeVideo} title="Close video" class="cursor-pointer">
					<XIcon />
				</button>
			</div>
			<progress
				class="progress-primary h-2"
				value={Math.floor(currentTime)}
				max={$video.duration}
			></progress>
		{/if}
	{/if}
	<div bind:this={miniplayerElement}></div>
</div>

{#if $video}
	{#key $video.id}
		{#if isLivestream}
			<YoutubeSource
				video={$video}
				class="rounded-lg"
				bind:element={videoElement as HTMLEmbedElement}
			/>
		{:else}
			<FileSource
				video={$video}
				class="rounded-lg"
				bind:element={videoElement as HTMLVideoElement}
			/>
		{/if}
	{/key}
{/if}

<style lang="postcss">
	progress {
		--rounded-box: 0;
	}
</style>
