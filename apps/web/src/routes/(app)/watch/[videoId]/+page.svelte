<script lang="ts">
	import Description from '$components/Description.svelte';
	import { setVideoContext } from '$lib/stores/video';
	import type { PageData } from './$types';

	let {
		data,
	}: {
		data: PageData;
	} = $props();

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
</section>
