<script lang="ts">
	import Card from '$components/Card.svelte';
	import Description from '$components/Description.svelte';
	import type { PageData } from '../$types';

	let {
		data,
	}: {
		data: PageData;
	} = $props();
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<Card>
	<Description text={data.channel.description} />
	{#if data.channel.tags.length > 0}
		<div class="flex gap-1 flex-wrap">
			{#each data.channel.tags as tag}
				<span class="badge badge-neutral whitespace-nowrap pb-0.5">{tag}</span>
			{/each}
		</div>
	{/if}
</Card>
