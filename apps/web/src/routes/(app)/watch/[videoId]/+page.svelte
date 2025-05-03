<script lang="ts">
	import Card from '$components/Card.svelte';
	import Description from '$components/Description.svelte';
	import ChatSidebar from '$components/videos/ChatSidebar.svelte';
	import { setVideoContext } from '$lib/stores/video';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	setVideoContext(data);

	let isLivestream = $derived<boolean>(
		data?.type === 'stream' && (data.status === 'live' || data.status === 'upcoming'),
	);

	let open = $state<boolean>(false);
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<section class="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-4">
	<div id="video-element" class="justify-center flex xl:col-start-1"></div>
	<div class="flex flex-col gap-4 xl:col-start-1">
		<div class="flex flex-col gap-2">
			<h2 class="font-bold text-3xl">{data.title}</h2>
			<a
				href="https://www.youtube.com/watch?v={data.id}"
				target="_blank"
				class="btn btn-primary w-min text-nowrap"
			>
				Watch on YouTube
			</a>
		</div>
		<Card classBody="overflow-y-hidden {open ? 'h-auto' : 'h-32'}">
			<Description videoId={data.id} text={data.description} />
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
			video={data}
			class="h-[512px] xl:h-screen w-full rounded row-start-2 xl:row-span-2 xl:col-start-2 xl:row-start-1"
		/>
	{/if}
</section>
