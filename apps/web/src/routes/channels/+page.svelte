<script lang="ts">
	import Card from '$components/Card.svelte';
	import TextInput from '$components/TextInput.svelte';
	import { apiFetch } from '$lib/api';
	import { config } from '$lib/config';
	import type { Channel } from '$lib/types';
	import type { PageData } from './$types';

	export let data: PageData;

	let channelId = '';
	let modal: HTMLDialogElement;
	$: channels = data.channels;

	async function addChannel() {
		const response = await apiFetch<Channel>('/channels', {
			fetch,
			method: 'POST',
			body: JSON.stringify({ id: channelId })
		});

		channelId = '';
		if (response.raw.ok) {
			const channelRes = await response.json();
			channels = [...channels, channelRes];
		}
	}

	function toggleModal() {
		modal.showModal();
	}
</script>

<svelte:head>
	<title>Channels</title>
</svelte:head>

<section>
	<Card title="Channels">
		<div class="flex gap-2">
			<button class="btn btn-success" on:click={toggleModal}>Add</button>
		</div>
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th>Name</th>
					<th>ID</th>
					<th></th>
				</tr>
			</thead>

			<tbody>
				{#each channels as channel, i (i)}
					<tr>
						<th>{i + 1}</th>
						<td>
							<div class="flex items-center gap-3">
								<div class="avatar">
									<div class="mask mask-squircle h-12 w-12">
										<img
											src="http://{config.apiUrl}/assets/{channel.id}/assets/thumbnail.17.jpg"
											alt="Avatar Tailwind CSS Component"
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
						<td>
							{channel.id}
						</td>
						<td>
							<a
								role="button"
								class="btn btn-primary"
								target="_blank"
								href="https://www.youtube.com/{channel.customUrl}"
							>
								Link
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</Card>

	<ul>
		{#each channels as channel (channel.id)}
			<li>
				<div class="card card-compact w-96 bg-base-100 shadow">
					<figure>
						<img
							src="http://{config.apiUrl}/assets/{channel.id}/assets/thumbnail.12.jpg"
							alt="Avatar Tailwind CSS Component"
						/>
					</figure>
					<div class="card-body">
						<h2 class="card-title">{channel.name}</h2>
						<p>If a dog chews shoes whose shoes does he choose?</p>
					</div>
				</div>
			</li>
		{/each}
	</ul>

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
