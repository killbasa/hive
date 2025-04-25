<script lang="ts">
	import '$lib/styles/tailwind.css';
	import '$lib/styles/typography.css';

	import Toaster from '$components/Toaster.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<Toaster />

<main>
	{@render children()}
</main>
