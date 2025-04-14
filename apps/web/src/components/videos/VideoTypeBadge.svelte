<script lang="ts">
	import type { Video } from '$lib/types/videos';

	let {
		type,
	}: {
		type: Video['type'];
	} = $props();
</script>

{#if type === 'video'}
	<span class="badge badge-neutral">Video</span>
{:else if type === 'short'}
	<span class="badge badge-primary">Short</span>
{:else}
	<span class="badge badge-success">Stream</span>
{/if}
