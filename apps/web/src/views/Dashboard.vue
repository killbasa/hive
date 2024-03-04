<script setup lang="ts">
import { apiFetch } from '@/lib/api';
import { onMounted, ref } from 'vue';

onMounted(async () => {
	const [chRes, vidRes] = await Promise.all([
		apiFetch<{ count: number }>('/channels/stats'), //
		apiFetch<{ count: number }>('/videos/stats')
	]);

	const [chStats, vidStats] = await Promise.all([
		chRes.json(), //
		vidRes.json()
	]);

	stats.value = {
		channels: chStats.count,
		videos: vidStats.count
	};
});
</script>

<script lang="ts">
const stats = ref<{ channels: number; videos: number }>({
	channels: 0,
	videos: 0
});
</script>

<template>
	<div class="grid grid-cols-4 gap-8">
		<div class="stats border">
			<div class="stat">
				<div class="stat-title">Channels</div>
				<div class="stat-value">{{ stats.channels }}</div>
			</div>
		</div>
		<div class="stats border">
			<div class="stat">
				<div class="stat-title">Videos</div>
				<div class="stat-value">{{ stats.videos }}</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
