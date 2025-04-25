<script lang="ts">
	import Card from '$components/Card.svelte';
	import Description from '$components/Description.svelte';
	import { client } from '$lib/client';
	import { toast } from '$lib/stores/toasts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	async function scan() {
		const response = await client.POST('/channels/{channelId}/scan', {
			headers: { 'Content-Type': null },
			params: { path: { channelId: data.channel.id } },
		});

		if (response.response.ok) {
			toast.success('Channel scan started');
		} else {
			toast.error('Something went wrong');
		}
	}
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
<Card title="Actions">
	<button class="btn btn-success whitespace-nowrap w-min" onclick={scan}>Scan channel</button>
</Card>
