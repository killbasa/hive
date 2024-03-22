<script lang="ts">
	import { config } from '$lib/config';
	import type { PageData } from './$types';

	export let data: PageData;

	const videoKey = 'videoVolume';
	const baseUrl = `http://${config.apiUrl}/assets/${data.channelId}/${data.id}/`;

	function onVolumeChange() {
		localStorage.setItem(videoKey, video.volume.toString());
	}

	function setPlayerVolume(): void {
		const data = localStorage.getItem(videoKey) ?? '1';
		const parsed = parseInt(data);
		video.volume = isNaN(parsed) ? 1 : parsed;
	}

	let video: HTMLVideoElement;
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<section>
	<video
		poster="{baseUrl}/thumbnail.png"
		on:volumechange={onVolumeChange}
		on:loadstart={setPlayerVolume}
		controls
		autoplay
		playsinline
		id="video-item"
		width="100%"
		bind:this={video}
	>
		<source src="{baseUrl}/video.f137.mp4" type="video/mp4" id="video-source" />
		<track kind="captions" />
	</video>
	<div>
		{#each data.comments as comment, i (i)}
			<div>
				<h2>{comment.author}</h2>
				<p>{comment.text}</p>
			</div>
		{/each}
	</div>
</section>
