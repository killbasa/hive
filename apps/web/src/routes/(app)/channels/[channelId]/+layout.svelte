<script lang="ts">
	import Card from '$components/Card.svelte';
	import ChannelAvatar from '$components/channels/ChannelAvatar.svelte';
	import { config } from '$lib/config';
	import { humanFileSize } from '$lib/utils';
	import type { LayoutProps } from './$types';
	import { base } from '$app/paths';
	import { page } from '$app/state';

	let { data, children }: LayoutProps = $props();

	const channelUrl = `${config.assetsPath}/${data.channel.id}`;
	const bannerUrl = `${channelUrl}/assets/banner.jpg`;

	const tabs: { label: string; href: string }[] = [
		{ label: 'Videos', href: `${base}/channels/${data.channel.id}` },
		{ label: 'Streams', href: `${base}/channels/${data.channel.id}/streams` },
		{ label: 'Shorts', href: `${base}/channels/${data.channel.id}/shorts` },
		{ label: 'About', href: `${base}/channels/${data.channel.id}/about` },
		{ label: 'Downloads', href: `${base}/channels/${data.channel.id}/downloads` },
	];
</script>

<section class="flex flex-col gap-4">
	<Card classBody="pb-0">
		{#snippet figure()}
			<figure>
				<img src={bannerUrl} alt="Channel banner" />
			</figure>
		{/snippet}

		<div class="flex flex-col">
			<div class="flex">
				<ChannelAvatar channelId={data.channel.id} size={24} class="mr-4" />
				<div class="flex flex-col">
					<span class="text-4xl font-bold">{data.channel.name}</span>
					<div>
						<span>{data.stats.videos} videos</span> •
						<span>{data.stats.streams} streams</span> •
						<span>{data.stats.shorts} shorts</span>
					</div>
					<span>{humanFileSize(data.stats.directorySize)}</span>
				</div>
			</div>
		</div>

		<div role="tablist" class="tabs tabs-border mx-auto tabs-xl">
			{#each tabs as tab (tab.label)}
				<a
					role="tab"
					class="tab"
					href={tab.href}
					class:tab-active={page.url.pathname === tab.href}
				>
					{tab.label}
				</a>
			{/each}
		</div>
	</Card>

	{@render children()}
</section>
