<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		class: cls = '',
		classBody = '',
		classFooter = '',
		tab = false,
		children,
		figure,
		footer,
	}: {
		title?: string;
		class?: string;
		classBody?: string;
		classFooter?: string;
		tab?: boolean;
		children?: Snippet;
		figure?: Snippet;
		footer?: Snippet;
	} = $props();
</script>

<div
	class="border border-slate-700 bg-slate-800/30 {cls} {tab ? 'tab-content' : 'card rounded-md'}"
>
	{@render figure?.()}
	<div class="card-body {classBody}">
		{#if title}
			<h2 class="card-title border-b border-slate-700">{title}</h2>
		{/if}
		<div class="flex flex-col gap-2">
			{@render children?.()}
		</div>
	</div>
	{#if footer}
		<div class="card-actions justify-center border-t py-4 mx-6 border-slate-700 {classFooter}">
			{@render footer?.()}
		</div>
	{/if}
</div>
