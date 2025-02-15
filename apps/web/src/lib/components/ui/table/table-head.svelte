<script lang="ts">
	import { cn } from '$lib/components/utils';
	import type { HTMLThAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLThAttributes> = $props();
</script>

<th
	bind:this={ref}
	class={cn(
		'text-muted-foreground h-10 px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
		className,
	)}
	{...restProps}
>
	{@render children?.()}
</th>
