<script lang="ts">
	import { invalidate } from '$app/navigation';
	import Card from '$components/Card.svelte';
	import Pagination from '$components/navigation/Pagination.svelte';
	import TextInput from '$components/TextInput.svelte';
	import { apiFetch } from '$lib/fetch';
	import { MIMETypes } from '$lib/constants';
	import type { PageData } from './$types';
	import type { Channel } from '@hive/common';
	import ChannelAvatar from '$components/channels/ChannelAvatar.svelte';

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
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.channels as channel, i (i)}
					<tr>
						<td>
							<div class="flex items-center gap-3">
								<ChannelAvatar channelId={channel.id} />
								<div>
									<a href="/channels/{channel.id}">
										<div class="font-bold">{channel.name}</div>
									</a>
								</div>
							</div>
						</td>
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
