<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import type { Video } from '$lib/types/videos';

	let {
		type,
	}: {
		type: Video['type'];
	} = $props();
</script>

{#if type === 'video'}
	<Badge variant="default">Video</Badge>
{:else if type === 'short'}
	<Badge variant="default">Short</Badge>
{:else}
	<Badge variant="default">Stream</Badge>
{/if}
