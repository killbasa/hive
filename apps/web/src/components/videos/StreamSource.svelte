<script lang="ts">
	import type { Video } from '$lib/types/videos';

	let {
		video = $bindable(),
		element = $bindable(null),
	}: {
		video: Video;
		element: HTMLEmbedElement | null;
	} = $props();
</script>

<embed
	src="https://www.youtube.com/embed/{video.id}?autohide=1&autoplay=1"
	type="video/mp4"
	title={video.title}
	style="width: 100%; aspect-ratio: 16/9;"
	bind:this={element}
/>
