<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		children,
		figure,
		footer,
	}: {
		title?: string;
		children?: Snippet;
		figure?: Snippet;
		footer?: Snippet;
	} = $props();
</script>

<div class="card border rounded-md">
	{@render figure?.()}
	<div class="card-body">
		{#if title}
			<h2 class="card-title border-b">{title}</h2>
		{/if}
		<div class="flex flex-col gap-2">
			{@render children?.()}
		</div>
	</div>
	{#if footer}
		<div class="card-actions justify-center border-t py-4 mx-6">
			{@render footer?.()}
		</div>
	{/if}
</div>
