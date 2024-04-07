<script lang="ts">
	import { apiFetch } from '$lib/fetch';
	import { config } from '$lib/config';
	import { MIMETypes } from '$lib/constants';
	import type { PageData } from './$types';
	import { debounce, throttle } from '$lib/utils';

	export let data: PageData;

	const volumeKey = 'videoVolume';
	const baseUrl = `${config.apiUrl}/assets/${data.channelId}/videos/${data.id}`;

	let video: HTMLVideoElement;
	let hasPlayed = false;

	function onVolumeChange() {
		localStorage.setItem(volumeKey, video.volume.toString());
	}

	function loadPlayer(): void {
		const parsedTime = parseFloat(data.watchProgress);
		video.currentTime = isNaN(parsedTime) ? 0 : parsedTime;

		const local = localStorage.getItem(volumeKey) ?? '1';
		const parsedVol = parseFloat(local);
		video.volume = isNaN(parsedVol) ? 1 : parsedVol;
	}

	async function onTimeUpdate() {
		if (!hasPlayed) return;

		const time = video.currentTime;
		if (video.paused) return await debounceUpdate(time);

		await throttleUpdate(time);
	}

	const debounceUpdate = debounce(postUpdate, 500);
	const throttleUpdate = throttle(postUpdate, 2000);

	async function postUpdate(time: number) {
		await apiFetch(`/videos/${data.id}/progress`, {
			fetch,
			method: 'POST',
			headers: { 'content-type': MIMETypes.json },
			body: JSON.stringify({ progress: time })
		});
	}
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<section class="flex flex-col gap-4">
	<video
		poster="{baseUrl}/thumbnail.png"
		on:volumechange={onVolumeChange}
		on:loadstart={loadPlayer}
		on:timeupdate={onTimeUpdate}
		on:play={() => (hasPlayed = true)}
		controls
		playsinline
		id="video-item"
		width="100%"
		bind:this={video}
	>
		<source src="{baseUrl}/video.mp4" type="video/mp4" />
		<track kind="captions" />
	</video>
	<div>
		<h2>{data.title}</h2>
		<p class="whitespace-pre-wrap">{data.description}</p>
		<a href="https://www.youtube.com/watch?v={data.id}" target="_blank" class="btn">
			Watch on YouTube
		</a>
	</div>
	<div>
		<h2 class="card-title border-b">Comments</h2>
		<ul>
			{#each data.comments as comment (comment.id)}
				<li>
					{#if comment.isFavorited}
						<span>{comment.author} [❤️]</span>
					{:else if comment.author === data.channelId}
						<span class="text-blue-500">{comment.author}</span>
					{:else}
						<span>{comment.author}</span>
					{/if}
					<p>{comment.text}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>
