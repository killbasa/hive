<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		children,
	}: {
		title: string;
		children: Snippet;
	} = $props();
</script>

<h3 class="font-semibold text-lg mb-0 mt-2">{title}</h3>
<div class="flex flex-col gap-2">
	{@render children()}
</div>
