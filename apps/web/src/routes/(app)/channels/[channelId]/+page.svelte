<script lang="ts">
	import Card from '$components/Card.svelte';
	import Pagination from '$components/navigation/Pagination.svelte';
	import SearchInput from '$components/SearchInput.svelte';
	import VideoCard from '$components/videos/VideoCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.channel.name}</title>
</svelte:head>

<Card title="Videos ({data.total})">
	<div>
		<SearchInput placeholder="Filter videos" />
	</div>
	<div class="grid grid-cols-2 gap-4 lg:grid-cols-3 py-2">
		{#each data.videos as video (video.id)}
			<VideoCard {video} />
		{/each}
	</div>
	<svelte:fragment slot="footer">
		<Pagination count={data.videos.length} total={data.total} />
	</svelte:fragment>
</Card>
