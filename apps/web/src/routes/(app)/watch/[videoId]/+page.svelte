<script lang="ts">
	import type { PageData } from './$types';
	import { formatLinks } from '$lib/utils';
	import { onMount } from 'svelte';
	import { setVideoContext } from '$lib/stores/video';

	export let data: PageData;
	setVideoContext(data);

	let description: HTMLParagraphElement;

	onMount(() => {
		description.innerHTML = formatLinks(data.description);
	});
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<section class="flex flex-col gap-4">
	<div id="video-element"></div>
	<div>
		<h2>{data.title}</h2>
		<p class="whitespace-pre-wrap" bind:this={description}></p>
		<a href="https://www.youtube.com/watch?v={data.id}" target="_blank" class="btn">
			Watch on YouTube
		</a>
	</div>
	<div>
		<h2 class="card-title border-b">Comments</h2>
		<ul>
			{#each data.comments as comment (comment.id)}
				<li>
					{#if comment.isFavorited}
						<span>{comment.author} [❤️]</span>
					{:else if comment.author === data.channelId}
						<span class="text-blue-500">{comment.author}</span>
					{:else}
						<span>{comment.author}</span>
					{/if}
					<p>{comment.text}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>
