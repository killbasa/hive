<script lang="ts">
	import Card from '$components/Card.svelte';
	import Description from '$components/Description.svelte';
	import { setVideoContext } from '$lib/stores/video';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	setVideoContext(data);

	let open = $state<boolean>(false);
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<section class="flex flex-col gap-4">
	<div id="video-element" class="justify-center flex"></div>
	<div class="flex flex-col gap-4">
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
</section>
