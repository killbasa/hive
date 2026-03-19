<script lang="ts">
	import { formatLinks, formatTimestamps } from '$lib/utils';

	let {
		text,
		videoId,
	}: {
		text: string;
		videoId?: string;
	} = $props();

	let description = $derived.by<string>(() => {
		let formattedText = formatLinks(text);
		if (videoId) {
			formattedText = formatTimestamps(videoId, formattedText);
		}

		return formattedText;
	});
</script>

<p class="whitespace-pre-wrap">{@html description}</p>
