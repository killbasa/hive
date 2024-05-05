<script lang="ts">
	import Card from '$components/Card.svelte';
	import Description from '$components/Description.svelte';
	import type { PageData } from '../$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<Card>
	<Description text={data.channel.description} />
	<div class="flex gap-1 flex-wrap">
		{#each data.channel.tags as tag}
			<span class="badge badge-neutral whitespace-nowrap pb-0.5">{tag}</span>
		{/each}
	</div>
</Card>
