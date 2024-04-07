<script setup lang="ts">
	import type { Video } from '@hive/common';

	export let status: Video['status'];
</script>

{#if status === 'none'}
	<span class="badge badge-neutral">Video</span>
{:else}
	<span class="badge badge-success">Stream</span>
{/if}
