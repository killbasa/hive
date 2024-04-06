<script lang="ts">
	import VideoStatusBadge from '$components/videos/VideoStatusBadge.svelte';
	import { HiveWS } from '$lib/ws';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Card from '$components/Card.svelte';
	import { apiFetch } from '$lib/fetch';
	import { invalidate } from '$app/navigation';
	import { StatusEvent } from '$lib/utils';
	import Pagination from '$components/navigation/Pagination.svelte';
	import { MIMETypes } from '$lib/constants';
	import SearchInput from '$components/SearchInput.svelte';
	import { config } from '$lib/config';
	import type { DownloadProgress, DownloadStatus } from '$lib/types/ws';

	type DownloadInfo = {
		id: string;
		channelId: string;
		title: string;
		progress: DownloadProgress;
		percentage: string;
	};

	type ScanInfo = {
		channelId: string;
		channelPos: number;
		channelTotal: number;
		videoPos: number;
		videoTotal: number;
	};

	export let data: PageData;

	let ws: HiveWS;
	let allChecked = false;
	$: downloads = data.videos;

	let downloadInfo: DownloadInfo | null = null;
	let scanInfo: ScanInfo | null = null;

	let selectedVideos: string[];
	$: selectedVideos = [];

	function selectVideo(videoId: string) {
		if (selectedVideos.includes(videoId)) {
			selectedVideos = selectedVideos.filter((id) => id !== videoId);
		} else {
			selectedVideos = [...selectedVideos, videoId];
		}
	}

	function selectAll() {
		if (allChecked) {
			selectedVideos = [];
		} else {
			selectedVideos = downloads.map(({ id }) => id);
		}
	}

	async function startDownloads() {
		await apiFetch('/downloads/start', {
			fetch,
			method: 'POST',
			headers: { 'content-type': MIMETypes.json },
			body: JSON.stringify({ videoIds: Array.from(selectedVideos) })
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
			headers: { 'content-type': MIMETypes.json },
			body: JSON.stringify({ videoIds: Array.from(selectedVideos) })
		});

		await invalidate('state:downloads');
		allChecked = false;
		selectedVideos = [];
	}

	onMount(() => {
		ws = new HiveWS('/status/downloads');

		ws.onOpen(() => {
			console.log('[hive] connected');
		});
		ws.onClose(() => {
			console.log('[hive] disconnected');
		});

		ws.onMessage<string>(async (event) => {
			const update: DownloadStatus = JSON.parse(`${event.data}`);
			if (update.type === StatusEvent.DownloadCancelled) {
				downloadInfo = null;
			} else if (update.type === StatusEvent.DownloadUpdate) {
				downloadInfo = {
					id: update.data.id,
					channelId: update.channelId,
					title: update.title,
					progress: update.data,
					percentage: update.data.percentage.trim().slice(0, -1)
				};

				if (update.data.status === 'finished') {
					await invalidate('state:downloads');
				}
			} else if (update.type === StatusEvent.ScanComplete) {
				scanInfo = null;
				await invalidate('state:downloads');
			} else if (update.type === StatusEvent.ScanUpdate) {
				scanInfo = {
					channelId: update.channelId,
					channelPos: update.channelPos,
					channelTotal: update.channelTotal,
					videoPos: update.videoPos,
					videoTotal: update.videoTotal
				};
			}
		});

		return () => {
			ws.close();
		};
	});

	$: disabled = selectedVideos.length === 0;
</script>

<svelte:head>
	<title>Downloads</title>
</svelte:head>

<section class="flex flex-col gap-4">
	<Card title="Scanning">
		{#if scanInfo}
			<div class="avatar">
				<div class="mask mask-circle h-12 w-12">
					<img
						src="{config.apiUrl}/assets/{scanInfo.channelId}/assets/thumbnail.avatar_uncropped.jpg"
						alt="Channel avatar"
					/>
				</div>
			</div>
			<a
				class="font-bold"
				target="_blank"
				href="https://www.youtube.com/channel/{scanInfo.channelId}"
			>
				{scanInfo.channelId}
			</a>
			<div>
				<span>{scanInfo.channelPos} / {scanInfo.channelTotal}</span>
				<progress
					class="progress progress-success"
					value={scanInfo.channelPos}
					max={scanInfo.channelTotal}
				></progress>
			</div>
			<div>
				<span>{scanInfo.videoPos} / {scanInfo.videoTotal}</span>
				<progress
					class="progress progress-success"
					value={scanInfo.videoPos}
					max={scanInfo.videoTotal}
				></progress>
			</div>
		{:else}
			None
		{/if}
	</Card>
	<Card title="Downloading">
		{#if downloadInfo}
			<div class="flex items-center gap-3">
				<div class="w-96">
					<img
						src="{config.apiUrl}/assets/{downloadInfo.channelId}/videos/{downloadInfo.id}/thumbnail.png"
						alt="Video thumbnail"
					/>
				</div>
			</div>
			<a
				class="font-bold"
				target="_blank"
				href="https://www.youtube.com/watch?v={downloadInfo.id}"
			>
				{downloadInfo.title}
			</a>
			<span>
				{downloadInfo.percentage}% ({downloadInfo.progress.eta} @ {downloadInfo.progress
					.speed})
			</span>
			<progress class="progress progress-success" value={downloadInfo.percentage} max="100" />
			<button class="btn btn-error w-min" type="button" on:click={stop}>Stop</button>
		{:else}
			None
		{/if}
	</Card>
	<Card title="Downloads ({downloads.length}/{data.total})">
		<div class="justify-between flex">
			<div class="flex gap-2">
				<button class="btn btn-success" on:click={startDownloads}>Download</button>
				<button class="btn btn-error" {disabled} on:click={ignore}>Ignore</button>
				<button class="btn btn-success" on:click={scan}>Scan channels</button>
			</div>
			<div>
				<SearchInput placeholder="Filter videos" />
			</div>
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
									on:change={() => selectVideo(video.id)}
									checked={selectedVideos.includes(video.id)}
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
										src="{config.apiUrl}/assets/{video.channelId}/videos/{video.id}/thumbnail.png"
										alt="Video thumbnail"
										loading="lazy"
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
		<div class="card-actions justify-center">
			<Pagination count={data.videos.length} total={data.total} />
		</div>
	</Card>
</section>
