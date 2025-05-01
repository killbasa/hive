<script lang="ts">
	import type { PageProps } from './$types';
	import VideoCard from '$components/videos/VideoCard.svelte';

	let { data }: PageProps = $props();

	let liveVideos = $derived(
		data.videos.filter((video) => {
			return video.status === 'live';
		}),
	);

	let upcomingVideos = $derived(
		data.videos.filter((video) => {
			return video.status === 'upcoming';
		}),
	);
</script>

<svelte:head>
	<title>Downloads</title>
</svelte:head>

<section class="flex flex-col gap-4">
	<h2 class="prose prose-2xl">Live</h2>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each liveVideos as video (video.id)}
			<VideoCard {video} showIcon />
		{/each}
	</div>

	<h2 class="prose prose-2xl">Upcoming</h2>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each upcomingVideos as video (video.id)}
			<VideoCard {video} showIcon />
		{/each}
	</div>
</section>
