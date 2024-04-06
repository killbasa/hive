<script lang="ts">
	import Card from '$components/Card.svelte';
	import { config } from '$lib/config';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	const channelUrl = `${config.apiUrl}/assets/${data.channel.id}`;
</script>

<section class="flex flex-col gap-4">
	<Card title={data.channel.name}>
		<svelte:fragment slot="figure">
			<figure>
				<img src="{channelUrl}/assets/thumbnail.12.jpg" alt="Channel banner" />
			</figure>
		</svelte:fragment>
		<p class="whitespace-pre-wrap">{data.channel.description}</p>
		<div class="flex gap-1 flex-wrap">
			{#each data.channel.tags.split(',') as tag}
				<span class="badge badge-neutral whitespace-nowrap">{tag}</span>
			{/each}
		</div>
	</Card>
	<slot />
</section>
