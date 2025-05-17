<script lang="ts">
	import VideoCard from '$components/videos/VideoCard.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Hive</title>
</svelte:head>

<section class="flex flex-col gap-4">
	<h1 class="prose prose-2xl">Continue watching</h1>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.videos as video (video.id)}
			<VideoCard {video} showIcon />
		{/each}
	</div>
</section>
