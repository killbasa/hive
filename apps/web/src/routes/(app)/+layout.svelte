<script lang="ts">
	import Footer from '$components/navigation/Footer.svelte';
	import Navbar from '$components/navigation/Navbar.svelte';
	import VideoPlayer from '$components/videos/VideoPlayer.svelte';
	import { initVideoContext } from '$lib/stores/video';
	import type { Snippet } from 'svelte';

	let {
		children,
	}: {
		children: Snippet;
	} = $props();

	initVideoContext();
</script>

<Navbar />
<div class="flex min-h-screen flex-col justify-between p-[7rem,2rem,2rem,4rem]">
	<div class="mx-auto w-full max-w-7xl px-8 py-8 xl:px-0">
		{@render children()}
	</div>
</div>
<Footer />

<VideoPlayer />
