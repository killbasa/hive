<script lang="ts">
	import type { Video } from '$lib/types/videos';

	let {
		video,
		class: cls = '',
	}: {
		video: Video;
		class?: string;
	} = $props();
</script>

<aside class={cls}>
	<iframe
		title="YouTube Live Chat"
		src="https://www.youtube.com/live_chat?v={video.id}&embed_domain={window.location.hostname}"
		frameborder="0"
		class="h-full w-full"
	></iframe>
</aside>
