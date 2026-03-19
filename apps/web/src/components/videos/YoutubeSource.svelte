<script lang="ts">
	import type { Video } from '$lib/types/videos';

	// TODO - Need to restore timestamp when going to mini player

	let {
		video = $bindable(),
		element = $bindable(null),
		class: cls = '',
	}: {
		video: Video;
		element: HTMLEmbedElement | null;
		class?: string;
	} = $props();
</script>

<embed
	id="video-player"
	src="https://www.youtube.com/embed/{video.id}?autohide=1&autoplay=1"
	type="video/mp4"
	title={video.title}
	style="width: 100%; aspect-ratio: 16/9;"
	class={cls}
	bind:this={element}
/>
