<script lang="ts">
	import '$lib/styles/tailwind.css';
	import '$lib/styles/typography.css';

	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<main>
	{@render children()}
</main>
