<script lang="ts">
	import Card from '$components/Card.svelte';
	import ChannelAvatar from '$components/channels/ChannelAvatar.svelte';
	import { config } from '$lib/config';
	import { humanFileSize } from '$lib/utils';
	import type { LayoutProps } from './$types';
	import { base } from '$app/paths';

	let { data, children }: LayoutProps = $props();

	const channelUrl = `${config.assetsPath}/${data.channel.id}`;
	const navStyle = 'text-md btn btn-primary';
</script>

<section class="flex flex-col gap-4">
	<Card>
		{#snippet figure()}
			<figure>
				<img src="{channelUrl}/assets/banner.jpg" alt="Channel banner" />
			</figure>
		{/snippet}

		<div class="flex flex-col">
			<div class="flex items-center">
				<ChannelAvatar channelId={data.channel.id} size={24} class="mr-4" />
				<span class="text-4xl font-bold">{data.channel.name}</span>
			</div>
			<div class="stats w-min">
				<div class="stat">
					<div class="stat-title">Videos</div>
					<div class="stat-value">{data.stats.videos}</div>
				</div>

				<div class="stat">
					<div class="stat-title">Streams</div>
					<div class="stat-value">{data.stats.streams}</div>
				</div>

				<div class="stat">
					<div class="stat-title">Shorts</div>
					<div class="stat-value">{data.stats.shorts}</div>
				</div>

				<div class="stat">
					<div class="stat-title">Size</div>
					<div class="stat-value">
						{humanFileSize(data.stats.directorySize)}
					</div>
				</div>
			</div>
		</div>

		<ul class="flex flex-row mx-auto gap-2">
			<a href="{base}/channels/{data.channel.id}" class={navStyle}>
				<li>Videos</li>
			</a>
			<a href="{base}/channels/{data.channel.id}/streams" class={navStyle}>
				<li>Streams</li>
			</a>
			<a href="{base}/channels/{data.channel.id}/shorts" class={navStyle}>
				<li>Shorts</li>
			</a>
			<a href="{base}/channels/{data.channel.id}/about" class={navStyle}>
				<li>About</li>
			</a>
			<a href="{base}/channels/{data.channel.id}/downloads" class={navStyle}>
				<li>Downloads</li>
			</a>
		</ul>
	</Card>
	{@render children()}
</section>
