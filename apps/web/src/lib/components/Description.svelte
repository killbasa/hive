<script lang="ts">
	import { formatLinks } from '$lib/utils';
	import { onMount } from 'svelte';

	export let text: string;

	let description: HTMLParagraphElement;

	onMount(() => {
		description.innerHTML = formatLinks(text);
	});
</script>

<p class="whitespace-pre-wrap" bind:this={description}></p>
