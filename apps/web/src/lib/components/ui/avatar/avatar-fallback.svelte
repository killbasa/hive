<script lang="ts">
	import { cn } from '$lib/components/utils';
	import { Avatar as AvatarPrimitive } from 'bits-ui';

	let {
		class: className,
		ref = $bindable(null),
		...restProps
	}: AvatarPrimitive.FallbackProps = $props();
</script>

<AvatarPrimitive.Fallback
	bind:ref
	class={cn('bg-muted flex h-full w-full items-center justify-center rounded-full', className)}
	{...restProps}
/>
