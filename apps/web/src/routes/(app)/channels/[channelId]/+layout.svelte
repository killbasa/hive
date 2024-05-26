<script lang="ts">
	import Card from '$components/Card.svelte';
	import ChannelAvatar from '$components/channels/ChannelAvatar.svelte';
	import { client } from '$lib/client';
	import { config } from '$lib/config';
	import { toast } from '$lib/stores/toasts';
	import { humanFileSize } from '$lib/utils';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	const channelUrl = `${config.apiUrl}/assets/${data.channel.id}`;
	const navStyle = 'text-xl link-primary';

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

<section class="flex flex-col gap-4">
	<Card>
		<svelte:fragment slot="figure">
			<figure>
				<img src="{channelUrl}/assets/banner.jpg" alt="Channel banner" />
			</figure>
		</svelte:fragment>
		<div class="flex items-center">
			<ChannelAvatar channelId={data.channel.id} size={24} class="mr-4" />
			<span class="text-5xl font-bold">{data.channel.name}</span>
		</div>
		<div>
			<span>videos: {data.stats.videos}</span>
			<span>streams: {data.stats.streams}</span>
			<span>shorts: {data.stats.shorts}</span>
			<span>size: {humanFileSize(data.stats.directorySize)}</span>
			<button class="btn btn-success" on:click={scan}>Scan channel</button>
		</div>
		<ul class="flex flex-row mx-auto gap-4">
			<a href="/channels/{data.channel.id}" class={navStyle}>
				<li>Videos</li>
			</a>
			<a href="/channels/{data.channel.id}/streams" class={navStyle}>
				<li>Streams</li>
			</a>
			<a href="/channels/{data.channel.id}/shorts" class={navStyle}>
				<li>Shorts</li>
			</a>
			<a href="/channels/{data.channel.id}/about" class={navStyle}>
				<li>About</li>
			</a>
			<a href="/channels/{data.channel.id}/downloads" class={navStyle}>
				<li>Downloads</li>
			</a>
		</ul>
	</Card>
	<slot />
</section>
