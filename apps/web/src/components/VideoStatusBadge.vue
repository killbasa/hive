<script setup lang="ts">
import type { Video } from '@/lib/types';

const props = defineProps<{
	status: Video['status'];
}>();
</script>

<template>
	<span class="badge badge-success" v-if="props.status === 'live'">Live</span>
	<span class="badge badge-warning" v-else-if="props.status === 'upcoming'">Upcoming</span>
	<span class="badge badge-error" v-else-if="props.status === 'past'">Past</span>
	<span class="badge badge-neutral" v-else>Video</span>
</template>
