<script lang="ts">
	import Card from '$components/Card.svelte';
	import ChannelAvatar from '$components/channels/ChannelAvatar.svelte';
	import { config } from '$lib/config';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	const channelUrl = `${config.apiUrl}/assets/${data.channel.id}`;
	const navStyle = 'text-xl link-primary';
</script>

<section class="flex flex-col gap-4">
	<Card>
		<svelte:fragment slot="figure">
			<figure>
				<img src="{channelUrl}/assets/thumbnail.12.jpg" alt="Channel banner" />
			</figure>
		</svelte:fragment>
		<div class="flex items-center">
			<ChannelAvatar channelId={data.channel.id} size={24} class="mr-4" />
			<span class="text-5xl font-bold">{data.channel.name}</span>
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
