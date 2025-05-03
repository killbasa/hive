<script lang="ts">
	import Sidebar from '$components/navigation/Sidebar.svelte';
	import Toaster from '$components/Toaster.svelte';
	import VideoPlayer from '$components/videos/VideoPlayer.svelte';
	import { initVideoContext } from '$lib/stores/video';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	initVideoContext();
</script>

<VideoPlayer />

<Toaster />

<div class="grid grid-cols-[auto_1fr] h-screen">
	<Sidebar />
	<div class="overflow-y-auto">
		<div class="space-y-4 p-4 mx-auto">
			{@render children()}
		</div>
	</div>
</div>
