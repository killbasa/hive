<script lang="ts">
	import { invalidate } from '$app/navigation';
	import Card from '$components/Card.svelte';
	import Pagination from '$components/navigation/Pagination.svelte';
	import TextInput from '$components/TextInput.svelte';
	import { apiFetch } from '$lib/fetch';
	import { config } from '$lib/config';
	import { MIMETypes } from '$lib/constants';
	import type { Channel } from '$lib/types/api';
	import type { PageData } from './$types';

	export let data: PageData;

	let channelId = '';
	let modal: HTMLDialogElement;

	async function addChannel() {
		await apiFetch<Channel>('/channels', {
			fetch,
			method: 'POST',
			headers: { 'content-type': MIMETypes.json },
			body: JSON.stringify({ id: channelId })
		});

		channelId = '';
	}

	function toggleModal() {
		modal.showModal();
	}

	async function refresh() {
		await invalidate('state:channels');
	}
</script>

<svelte:head>
	<title>Channels</title>
</svelte:head>

<section>
	<Card title="Channels">
		<div class="flex gap-2">
			<button class="btn btn-success" on:click={toggleModal}>Add</button>
			<button class="btn btn-primary" on:click={refresh}>Refresh</button>
		</div>
		<table class="table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Space used</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.channels as channel, i (i)}
					<tr>
						<td>
							<div class="flex items-center gap-3">
								<div class="avatar">
									<div class="mask mask-circle h-12 w-12">
										<img
											src="{config.apiUrl}/assets/{channel.id}/assets/thumbnail.avatar_uncropped.jpg"
											alt="Channel avatar"
										/>
									</div>
								</div>
								<div>
									<a href="/channels/{channel.id}">
										<div class="font-bold">{channel.name}</div>
									</a>
								</div>
							</div>
						</td>
						<td></td>
						<td>
							<a
								role="button"
								class="btn btn-primary"
								target="_blank"
								href="https://www.youtube.com/{channel.customUrl}"
							>
								Open in YouTube
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="card-actions justify-center">
			<Pagination count={data.channels.length} total={data.totalChannels} />
		</div>
	</Card>
	<dialog id="AddModal" class="modal" bind:this={modal}>
		<div class="modal-box">
			<h3 class="text-lg font-bold">Add a channel</h3>
			<div class="flex flex-col py-4">
				<TextInput id="channel-id" title="Channel ID" bind:value={channelId} />
			</div>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn" on:click={toggleModal}>Cancel</button>
					<button class="btn" on:click={addChannel}>Submit</button>
				</form>
			</div>
		</div>
	</dialog>
</section>