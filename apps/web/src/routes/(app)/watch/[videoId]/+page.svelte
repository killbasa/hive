<script lang="ts">
	import Card from '$components/Card.svelte';
	import ChannelAvatar from '$components/channels/ChannelAvatar.svelte';
	import EmbedLinks from '$components/videos/EmbedLinks.svelte';
	import ChatSidebar from '$components/videos/ChatSidebar.svelte';
	import { setVideoContext } from '$lib/stores/video';
	import { base } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	setVideoContext(data.video);

	let isLivestream = $derived<boolean>(
		data.video?.type === 'stream' &&
			(data.video.status === 'live' || data.video.status === 'upcoming'),
	);

	let open = $state<boolean>(false);
</script>

<svelte:head>
	<title>{data.video.title}</title>
</svelte:head>

<section class="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-4 max-w-7xl mx-auto">
	<div id="video-container" class="justify-center flex xl:col-start-1"></div>
	<div class="flex flex-col gap-4 xl:col-start-1">
		<div class="flex flex-col gap-2">
			<h2 class="font-semibold text-2xl">
				<EmbedLinks text={data.video.title} />
			</h2>
			<div class="flex justify-between">
				<div class="flex items-center gap-3">
					<ChannelAvatar channelId={data.channel.id} />
					<div>
						<a href="{base}/channels/{data.channel.id}">
							<div class="font-bold">{data.channel.name}</div>
						</a>
					</div>
				</div>
				<div class="flex items-center gap-4">
					<a
						href="https://www.youtube.com/watch?v={data.video.id}"
						target="_blank"
						class="btn btn-primary w-min text-nowrap"
					>
						Watch on YouTube
					</a>
					{#if !isLivestream}
						<button type="button" class="btn btn-primary w-min" disabled>
							Download
						</button>
					{/if}
				</div>
			</div>
		</div>
		<Card classBody="overflow-y-hidden {open ? 'h-auto' : 'h-32'}">
			<EmbedLinks videoId={data.video.id} text={data.video.description} />
			{#snippet footer()}
				<button type="button" class="cursor-pointer" onclick={() => (open = !open)}>
					{#if open}
						Show less
					{:else}
						Show more
					{/if}
				</button>
			{/snippet}
		</Card>
	</div>

	{#if isLivestream}
		<ChatSidebar
			video={data.video}
			class="h-[512px] xl:h-screen w-full rounded row-start-2 xl:row-span-2 xl:col-start-2 xl:row-start-1"
		/>
	{/if}
</section>
