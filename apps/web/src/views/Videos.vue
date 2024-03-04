<script setup lang="ts">
import { apiFetch } from '@/lib/api';
import { onMounted, ref } from 'vue';
import type { Video } from '@/lib/types';
import VideoStatusBadge from '@/components/VideoStatusBadge.vue';

onMounted(async () => {
	const videoRes = await apiFetch<{ videos: Video[] }>('/videos');
	const data = await videoRes.json();
	videos.value = data.videos;
});
</script>

<script lang="ts">
const videos = ref<Video[]>([]);

async function syncVideos() {
	await apiFetch('/videos/sync', {
		method: 'POST'
	});
}
</script>

<template>
	<div class="card border">
		<div class="card-body">
			<h2 class="card-title border-b">Videos</h2>
			<div class="flex gap-2">
				<button class="btn btn-success" @click="syncVideos">Sync</button>
			</div>
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr>
							<th>Status</th>
							<th>Name</th>
							<th>ID</th>
						</tr>
					</thead>

					<tbody>
						<template v-for="(video, i) in videos" :key="i">
							<tr>
								<td>
									<VideoStatusBadge :status="video.status" />
								</td>
								<td>
									<div class="flex items-center gap-3">
										<div class="avatar">
											<div class="mask mask-squircle h-12 w-12">
												<img :src="video.thumbnail" alt="Video thumbnail" />
											</div>
										</div>
										<div>
											<div class="font-bold">{{ video.title }}</div>
										</div>
									</div>
								</td>
								<td>
									{{ video.id }}
								</td>
							</tr>
						</template>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
