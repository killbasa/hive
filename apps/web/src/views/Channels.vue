<script setup lang="ts">
import { apiFetch } from '@/lib/api';
import { onMounted, ref } from 'vue';
import type { Channel } from '@/lib/types';

onMounted(async () => {
	const channelRes = await apiFetch<{ channels: Channel[] }>('/channels');
	const data = await channelRes.json();
	channels.value = data.channels;
});
</script>

<script lang="ts">
const channels = ref<Channel[]>([]);

let channelId: string;

async function addChannel() {
	const response = await apiFetch<Channel>('/channels', {
		method: 'POST',
		body: JSON.stringify({ id: channelId })
	});

	channelId = '';
	if (response.raw.ok) {
		const channelRes = await response.json();
		channels.value.push(channelRes);
	}
}

async function syncChannels() {
	await apiFetch('/channels/sync', {
		method: 'POST'
	});
}
</script>

<template>
	<div class="card border">
		<div class="card-body">
			<h2 class="card-title border-b">Channels</h2>
			<div class="flex gap-2">
				<button class="btn btn-success" onclick="AddModal.showModal()">Add</button>
				<button class="btn btn-success" @click="syncChannels">Sync</button>
			</div>
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr>
							<th>Name</th>
							<th>ID</th>
							<th></th>
						</tr>
					</thead>

					<tbody>
						<template v-for="(channel, i) in channels" :key="i">
							<tr>
								<td>
									<div class="flex items-center gap-3">
										<div class="avatar">
											<div class="mask mask-squircle h-12 w-12">
												<img :src="channel.photo" alt="Avatar Tailwind CSS Component" />
											</div>
										</div>
										<div>
											<div class="font-bold">{{ channel.name }}</div>
										</div>
									</div>
								</td>
								<td>
									{{ channel.id }}
								</td>
								<td>
									<a role="button" class="btn btn-primary" target="_blank" :href="`https://www.youtube.com/${channel.customUrl}`">Link</a>
								</td>
							</tr>
						</template>
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<dialog id="AddModal" class="modal">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Add a channel</h3>
			<div class="flex flex-col py-4">
				<div class="flex flex-col">
					<label for="channel-id">Channel ID</label>
					<input v-model="channelId" type="text" class="input input-bordered" id="channel-id" />
				</div>
			</div>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn" @click="addChannel">Submit</button>
				</form>
			</div>
		</div>
	</dialog>
</template>

<style scoped></style>
