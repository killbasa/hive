<script lang="ts">
	import { formatLinks, formatTimestamps } from '$lib/utils';
	import { onMount } from 'svelte';

	export let text: string;
	export let videoId: string | undefined = undefined;

	let description: HTMLParagraphElement;

	onMount(() => {
		let formattedText = formatLinks(text);
		if (videoId) {
			formattedText = formatTimestamps(videoId, formattedText);
		}

		description.innerHTML = formattedText;
	});
</script>

<p class="whitespace-pre-wrap" bind:this={description}></p>
