<script lang="ts">
	import Card from '$components/Card.svelte';
	import TextInput from '$components/TextInput.svelte';
	import ChannelAvatar from '$components/channels/ChannelAvatar.svelte';
	import Pagination from '$components/navigation/Pagination.svelte';
	import { client } from '$lib/client';
	import { toast } from '$lib/stores/toasts';
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';
	import { base } from '$app/paths';

	let {
		data,
	}: {
		data: PageData;
	} = $props();

	let channelId = $state('');
	let modal: HTMLDialogElement;

	async function addChannel() {
		const { response, error } = await client.PUT('/channels', {
			body: {
				id: channelId,
			},
		});

		if (response.ok) {
			channelId = '';
			toast.success('Channel added');
		} else if (response.status === 409) {
			toast.error('Channel already exists');
		} else if (response.status === 404) {
			toast.error('Channel not found');
		} else {
			toast.error(error?.message ?? 'An error occurred');
		}
	}

	function toggleModal() {
		channelId = '';
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
			<button class="btn btn-success" onclick={toggleModal}>Add</button>
			<button class="btn btn-primary" onclick={refresh}>Refresh</button>
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
									<a href="{base}/channels/{channel.id}">
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
		{#snippet footer()}
			<Pagination count={data.channels.length} total={data.total} />
		{/snippet}
	</Card>
	<dialog id="AddModal" class="modal" bind:this={modal}>
		<div class="modal-box">
			<h3 class="text-lg font-bold">Add a channel</h3>
			<div class="flex flex-col py-4">
				<TextInput id="channel-id" title="Channel ID" bind:value={channelId} />
			</div>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn" onclick={toggleModal}>Cancel</button>
					<button class="btn" onclick={addChannel}>Submit</button>
				</form>
			</div>
		</div>
	</dialog>
</section>
