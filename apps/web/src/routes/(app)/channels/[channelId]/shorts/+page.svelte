<script lang="ts">
	import Card from '$components/Card.svelte';
	import SearchInput from '$components/inputs/SearchInput.svelte';
	import VideoCard from '$components/videos/VideoCard.svelte';
	import Pagination from '$components/navigation/Pagination.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Shorts</title>
</svelte:head>

<Card title="Shorts ({data.total})">
	<div>
		<SearchInput placeholder="Filter videos" />
	</div>
	<div class="grid grid-cols-2 gap-4 lg:grid-cols-3 py-2">
		{#each data.videos as video (video.id)}
			<VideoCard {video} />
		{/each}
	</div>
	{#snippet footer()}
		<Pagination count={data.videos.length} total={data.total} pageSize={24} />
	{/snippet}
</Card>
