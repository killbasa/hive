<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import SearchInput from '$components/SearchInput.svelte';
	import VideoCard from '$components/videos/VideoCard.svelte';
	import Paginator from '$components/navigation/Paginator.svelte';
	import type { PageData } from './$types';

	let {
		data,
	}: {
		data: PageData;
	} = $props();
</script>

<svelte:head>
	<title>Streams</title>
</svelte:head>

<Card.Root title="Streams ({data.total})">
	<Card.Header>
		<Card.Title>Streams ({data.total})</Card.Title>
	</Card.Header>
	<Card.Content>
		<div>
			<SearchInput placeholder="Filter videos" />
		</div>
		<div class="grid grid-cols-2 gap-4 lg:grid-cols-3 py-2">
			{#each data.videos as video (video.id)}
				<VideoCard {video} />
			{/each}
		</div>
	</Card.Content>
	<Card.Footer>
		<Paginator perPage={24} total={data.total} />
	</Card.Footer>
</Card.Root>
