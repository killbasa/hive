<script lang="ts">
	import Description from '$components/Description.svelte';
	import { setVideoContext } from '$lib/stores/video';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;
	setVideoContext(data);
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<section class="flex flex-col gap-4">
	<div id="video-element" class="justify-center flex"></div>
	<div>
		<h2>{data.title}</h2>
		<Description videoId={data.id} text={data.description} />
		<a href="https://www.youtube.com/watch?v={data.id}" target="_blank" class="btn">
			Watch on YouTube
		</a>
	</div>
	<div>
		<h2 class="card-title border-b">Comments</h2>
		{Number($page.url.searchParams.get('t'))}
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
