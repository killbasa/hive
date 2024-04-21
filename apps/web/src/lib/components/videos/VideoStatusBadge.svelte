<script setup lang="ts">
	import type { Video } from '@hive/common';

	export let type: Video['type'];
</script>

{#if type === 'video'}
	<span class="badge badge-neutral">Video</span>
{:else if type === 'short'}
	<span class="badge badge-primary">Short</span>
{:else}
	<span class="badge badge-success">Stream</span>
{/if}
