<script lang="ts">
	import { config } from '$lib/config';
	import type { PageData } from './$types';

	export let data: PageData;

	const volumeKey = 'videoVolume';
	const baseUrl = `http://${config.apiUrl}/assets/${data.channelId}/videos/${data.id}`;

	let video: HTMLVideoElement;

	function onVolumeChange() {
		localStorage.setItem(volumeKey, video.volume.toString());
	}

	function setPlayerVolume(): void {
		const data = localStorage.getItem(volumeKey) ?? '1';
		const parsed = parseFloat(data);
		video.volume = isNaN(parsed) ? 1 : parsed;
	}
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
		<p>{data.description}</p>
	</div>
	<ul>
		{#each data.comments as comment (comment.id)}
			<li>
				<strong>{comment.author}</strong>
				<p>{comment.text}</p>
			</li>
		{/each}
	</ul>
</section>
