<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Pagination as PaginationPrimitive } from 'bits-ui';
	import type { Props } from '$lib/components/ui/button/index.js';

	let {
		ref = $bindable(null),
		class: className,
		size = 'icon',
		isActive = false,
		page,
		children,
		...restProps
	}: PaginationPrimitive.PageProps &
		Props & {
			isActive: boolean;
		} = $props();
</script>

{#snippet Fallback()}
	{page.value}
{/snippet}

<PaginationPrimitive.Page
	bind:ref
	{page}
	class={cn(
		buttonVariants({
			variant: isActive ? 'outline' : 'ghost',
			size,
		}),
		className,
	)}
	children={children || Fallback}
	{...restProps}
/>
