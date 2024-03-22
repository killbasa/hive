<script lang="ts">
	import VideoStatusBadge from '$components/VideoStatusBadge.svelte';
	import { config } from '$lib/config';
	import { Socket } from '$lib/ws';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Card from '$components/Card.svelte';
	import type { Video, YtdlpProgress } from '$lib/types';
	import { apiFetch } from '$lib/api';

	export let data: PageData;

	let socket: Socket;
	let allChecked = false;
	let messages: string[] = [];
	let downloads: { video: Video; download: boolean }[] = data.videos.map((video) => {
		return { video, download: false };
	});

	let progress = '';
	let currentDownload: Video | null = null;

	function selectAll() {
		downloads = downloads.map((entry) => {
			return { ...entry, download: !allChecked };
		});
	}

	async function ignoreVideos() {
		const videoIds = downloads //
			.filter(({ download }) => download)
			.map(({ video }) => video.id);

		await apiFetch(`http://${config.apiUrl}/videos/ignore`, {
			fetch,
			method: 'POST',
			body: JSON.stringify({ videoIds })
		});
	}

	async function startDownloads() {
		await apiFetch(`http://${config.apiUrl}/downloads/start`, {
			fetch,
			method: 'POST'
		});
	}

	async function ping() {
		await apiFetch(`http://${config.apiUrl}/status`, {
			fetch,
			method: 'POST'
		});
	}

	onMount(() => {
		socket = new Socket('ws://localhost:3001/status');

		socket.onMessage<string>((event) => {
			if (messages.length > 25) {
				messages.shift();
			}

			const ytdlpProgress: YtdlpProgress = JSON.parse(event.data);
			progress = ytdlpProgress.percentage.trim().slice(0, -1);
			currentDownload = data.videos.find((video) => video.id === ytdlpProgress.id) ?? null;

			messages = [...messages, event.data];
		});
	});

	$: disabled = downloads.filter(({ download }) => download).length === 0;
</script>

<svelte:head>
	<title>Downloads</title>
</svelte:head>

<section class="flex flex-col gap-4">
	<Card title="Logs">
		<div class="terminal">
			<div class="window">
				{#each messages as message, i (i)}
					<pre>{message}</pre>
				{/each}
			</div>
		</div>
	</Card>
	<Card title="Downloading">
		{#if currentDownload}
			<div class="flex items-center gap-3">
				<div class="w-48">
					<img
						src="http://{config.apiUrl}/assets/{currentDownload.channelId}/videos/{currentDownload.id}/thumbnail.png"
						alt="Video thumbnail"
					/>
				</div>
			</div>
			<span>{progress}%</span>
			<progress class="progress progress-success" value={progress} max="100"></progress>
		{:else}
			None
		{/if}
	</Card>
	<Card title="Downloads">
		<div class="flex gap-2">
			<button class="btn btn-success" on:click={startDownloads}>Download</button>
			<button class="btn btn-error" {disabled} on:click={ignoreVideos}>Ignore</button>
			<button class="btn btn-success" on:click={ping}>Ping</button>
		</div>
		<table class="table">
			<thead>
				<tr>
					<th>
						<label>
							<input
								type="checkbox"
								class="checkbox"
								on:click={selectAll}
								bind:checked={allChecked}
							/>
						</label>
					</th>
					<th>Status</th>
					<th>Thumbnail</th>
					<th>Title</th>
					<th>Size</th>
				</tr>
			</thead>

			<tbody>
				{#each downloads as { video, download } (video.id)}
					<tr>
						<th>
							<label>
								<input type="checkbox" class="checkbox" bind:checked={download} />
							</label>
						</th>
						<td>
							<VideoStatusBadge status={video.status} />
						</td>
						<td>
							<div class="flex items-center gap-3">
								<div class="w-48">
									<img
										src="http://{config.apiUrl}/assets/{video.channelId}/videos/{video.id}/thumbnail.png"
										alt="Video thumbnail"
									/>
								</div>
							</div>
						</td>
						<td>
							<a
								class="font-bold"
								target="_blank"
								href="https://www.youtube.com/watch?v={video.id}"
							>
								{video.title}
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</Card>
</section>

<style>
	.terminal {
		background-color: rgba(156, 163, 175, 0.7);
		width: 100%;
		height: 100%;
		text-align: left;
		font-family: consolas, Monaco;
		border-radius: 0.25rem;
		line-height: 1.25rem;
		font-size: 0.85rem;
	}

	.window {
		overflow-y: scroll;
		padding: 0.5rem;
		background-color: rgba(8, 8, 8, 0.5);
		height: 100%;
		color: #e8e8e8;
		min-height: 200px;
	}

	.window pre {
		font-family: inherit;
		margin: 0px;
	}
</style>
