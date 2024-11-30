<script lang="ts">
	import VideoCard from '$components/videos/VideoCard.svelte';
	import type { PageData } from './$types';

	let {
		data,
	}: {
		data: PageData;
	} = $props();
</script>

<svelte:head>
	<title>Hive</title>
</svelte:head>

<section class="flex flex-col gap-4">
	<h2>Continue watching</h2>
	<div class="grid grid-cols-2 gap-4">
		{#each data.videos as video (video.id)}
			<VideoCard {video} showIcon />
		{/each}
	</div>
</section>
