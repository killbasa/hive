<script lang="ts">
	import TextInput from '$components/TextInput.svelte';
	import ChannelAvatar from '$components/channels/ChannelAvatar.svelte';
	import { client } from '$lib/client';
	import { toast } from '$lib/stores/toasts';
	import * as Card from '$lib/components/ui/card/index.js';
	import Paginator from '$components/navigation/Paginator.svelte';
	import Button from '$components/ui/button/button.svelte';
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';

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
	<Card.Root title="Channels">
		<Card.Content>
			<div class="flex gap-2">
				<Button onclick={toggleModal}>Add</Button>
				<Button onclick={refresh}>Refresh</Button>
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
								<Button
									role="button"
									target="_blank"
									href="https://www.youtube.com/{channel.customUrl}"
								>
									Open in YouTube
								</Button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</Card.Content>
		<Card.Footer>
			<Paginator perPage={24} total={data.total} />
		</Card.Footer>
	</Card.Root>
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
