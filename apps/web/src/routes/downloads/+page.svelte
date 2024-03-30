<script lang="ts">
	import VideoStatusBadge from '$components/VideoStatusBadge.svelte';
	import { config } from '$lib/config';
	import { Socket } from '$lib/ws';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Card from '$components/Card.svelte';
	import type { DownloadProgress, DownloadStatus } from '$lib/types';
	import { apiFetch } from '$lib/api';
	import { invalidate } from '$app/navigation';
	import { StatusEvent } from '$lib/utils';

	export let data: PageData;

	let socket: Socket;
	let allChecked = false;
	$: downloads = data.videos;

	let downloadProgress = '';
	let video: { id: string; channelId: string; title: string } | null = null;
	let current: DownloadProgress | null = null;

	let scanProgress: { current: number; total: number; channelId: string } | null = null;

	let videosToIgnore: string[];
	$: videosToIgnore = [];

	function ignoreVideo(videoId: string) {
		if (videosToIgnore.includes(videoId)) {
			videosToIgnore = videosToIgnore.filter((id) => id !== videoId);
		} else {
			videosToIgnore = [...videosToIgnore, videoId];
		}
	}

	function selectAll() {
		if (allChecked) {
			videosToIgnore = [];
		} else {
			videosToIgnore = downloads.map(({ id }) => id);
		}
	}

	async function startDownloads() {
		await apiFetch('/downloads/start', {
			fetch,
			method: 'POST'
		});
	}

	async function scan() {
		await apiFetch('/downloads/scan', {
			fetch,
			method: 'POST'
		});
	}

	async function stop() {
		await apiFetch('/downloads/stop', {
			fetch,
			method: 'POST'
		});
	}

	async function ignore() {
		await apiFetch('/videos/ignore', {
			fetch,
			method: 'POST',
			body: JSON.stringify({ videoIds: Array.from(videosToIgnore) })
		});

		await invalidate('state:downloads');
		allChecked = false;
		videosToIgnore = [];
	}

	onMount(() => {
		socket = new Socket('/status/downloads');

		socket.onOpen(() => {
			console.log('[hive] connected');
		});
		socket.onClose(() => {
			console.log('[hive] disconnected');
		});

		socket.onMessage<string>(async (event) => {
			const update: DownloadStatus = JSON.parse(`${event.data}`);
			if (update.type === StatusEvent.DownloadCancelled) {
				video = null;
				current = null;
			} else if (update.type === StatusEvent.DownloadUpdate) {
				downloadProgress = update.data.percentage.trim().slice(0, -1);

				video = {
					title: update.title,
					id: update.data.id,
					channelId: update.channelId
				};
				current = update.data;

				if (update.data.status === 'finished') {
					await invalidate('state:downloads');
				}
			} else if (update.type === StatusEvent.ScanComplete) {
				scanProgress = null;
				await invalidate('state:downloads');
			} else if (update.type === StatusEvent.ScanUpdate) {
				scanProgress = {
					channelId: update.channelId,
					current: update.current,
					total: update.total
				};
			}
		});

		return () => {
			socket.close();
		};
	});

	$: disabled = videosToIgnore.length === 0;
</script>

<svelte:head>
	<title>Downloads</title>
</svelte:head>

<section class="flex flex-col gap-4">
	<Card title="Scanning">
		{#if scanProgress}
			<div class="avatar">
				<div class="mask mask-squircle h-12 w-12">
					<img
						src="http://{config.apiUrl}/assets/{scanProgress.channelId}/assets/thumbnail.avatar_uncropped.jpg"
						alt="Channel avatar"
					/>
				</div>
			</div>
			<a
				class="font-bold"
				target="_blank"
				href="https://www.youtube.com/channel/{scanProgress.channelId}"
			>
				{scanProgress.channelId}
			</a>
			<span>{scanProgress.current} / {scanProgress.total}</span>
			<progress
				class="progress progress-success"
				value={scanProgress.current}
				max={scanProgress.total}
			></progress>
		{:else}
			None
		{/if}
	</Card>
	<Card title="Downloading">
		{#if video}
			<div class="flex items-center gap-3">
				<div class="w-96">
					<img
						src="http://{config.apiUrl}/assets/{video.channelId}/videos/{video.id}/thumbnail.png"
						alt="Video thumbnail"
					/>
				</div>
			</div>
			<a class="font-bold" target="_blank" href="https://www.youtube.com/watch?v={video.id}">
				{video.title}
			</a>
			{#if current}
				<span>{downloadProgress}% ({current.eta} @ {current.speed})</span>
				<progress class="progress progress-success" value={downloadProgress} max="100"
				></progress>
			{/if}
			<button class="btn btn-error w-min" type="button" on:click={stop}>Stop</button>
		{:else}
			None
		{/if}
	</Card>
	<Card title="Downloads ({downloads.length}/{data.total})">
		<div class="flex gap-2">
			<button class="btn btn-success" on:click={startDownloads}>Download</button>
			<button class="btn btn-error" {disabled} on:click={ignore}>Ignore</button>
			<button class="btn btn-success" on:click={scan}>Scan channels</button>
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
				{#each downloads as video (video.id)}
					<tr>
						<th>
							<label>
								<input
									name="select-video"
									type="checkbox"
									class="checkbox"
									on:change={() => ignoreVideo(video.id)}
									checked={videosToIgnore.includes(video.id)}
								/>
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
