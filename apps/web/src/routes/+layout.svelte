<script lang="ts">
	import '$lib/styles/global.css';
	import '$lib/styles/tailwind.postcss';
	import '$lib/styles/typography.css';

	import Toaster from '$components/Toaster.svelte';
	import type { Snippet } from 'svelte';

	let {
		children,
	}: {
		children: Snippet;
	} = $props();
</script>

<Toaster />

<main class="flex flex-col">
	{@render children()}
</main>
