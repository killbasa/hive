<script lang="ts">
	import Card from '$components/Card.svelte';
	import SearchInput from '$components/SearchInput.svelte';
	import VideoCard from '$components/videos/VideoCard.svelte';
	import Pagination from '$components/navigation/Pagination.svelte';
	import type { PageData } from './$types';

	let {
		data,
	}: {
		data: PageData;
	} = $props();
</script>

<svelte:head>
	<title>Shorts</title>
</svelte:head>

<Card title="Streams ({data.total})">
	<div>
		<SearchInput placeholder="Filter videos" />
	</div>
	<div class="grid grid-cols-2 gap-4 lg:grid-cols-3 py-2">
		{#each data.videos as video (video.id)}
			<VideoCard {video} />
		{/each}
	</div>
	{#snippet footer()}
		<Pagination count={data.videos.length} total={data.total} />
	{/snippet}
</Card>
