<script lang="ts">
	import { StatusEvent } from '@hive/common';
	import { onMount } from 'svelte';
	import type { DownloadProgress, DownloadStatus } from '@hive/common';
	import type { PageProps } from './$types';
	import Card from '$components/Card.svelte';
	import SearchInput from '$components/SearchInput.svelte';
	import VideoTypeBadge from '$components/videos/VideoTypeBadge.svelte';
	import { client } from '$lib/client';
	import { config } from '$lib/config';
	import { toast } from '$lib/stores/toasts';
	import { formatDuration, formatFileSize } from '$lib/utils';
	import { HiveWebSocket } from '$lib/ws';
	import Pagination from '$components/navigation/Pagination.svelte';
	import { invalidate } from '$app/navigation';

	type DownloadInfo = {
		id: string;
		channelId: string;
		title: string;
		progress: DownloadProgress;
		percentage: string;
	};

	let { data }: PageProps = $props();

	let allChecked: boolean = $state(false);

	let downloadInfo: DownloadInfo | null = $state(null);

	let selectedVideos: string[] = $state([]);
	let disabled: boolean = $derived(selectedVideos.length === 0);

	function selectVideo(videoId: string): void {
		if (selectedVideos.includes(videoId)) {
			selectedVideos = selectedVideos.filter((id) => id !== videoId);
		} else {
			selectedVideos.push(videoId);
		}
	}

	function selectAll(): void {
		if (allChecked) {
			selectedVideos = [];
		} else {
			selectedVideos = data.videos.map(({ id }) => id);
		}
	}

	async function startDownloads(): Promise<void> {
		const { response } = await client.POST('/downloads/start', {
			body: {
				videoIds: selectedVideos,
			},
		});

		if (response.ok) {
			toast.success('Download started');
		} else {
			toast.error('Something went wrong');
		}
	}

	async function stop(): Promise<void> {
		await client.POST('/downloads/stop', {
			headers: { 'Content-Type': null },
		});
	}

	async function ignore(): Promise<void> {
		const response = await client.POST('/videos/ignore', {
			body: {
				videoIds: selectedVideos,
			},
		});

		await invalidate('state:downloads');
		allChecked = false;
		selectedVideos = [];

		if (response.response.ok) {
			toast.success('Video(s) ignored');
		} else {
			toast.error('Something went wrong');
		}
	}

	onMount(() => {
		const ws = new HiveWebSocket('/downloads/status');

		ws.onOpen(() => {
			console.log('[hive] connected');
		});
		ws.onClose(() => {
			console.log('[hive] disconnected');
		});

		ws.onMessage<string>(async (event) => {
			const update: DownloadStatus = JSON.parse(`${event.data}`);

			if (update.type === StatusEvent.DownloadComplete) {
				downloadInfo = null;

				await invalidate('state:downloads');
				return;
			}

			if (update.type === StatusEvent.DownloadUpdate) {
				downloadInfo = {
					id: update.data.id,
					channelId: update.channelId,
					title: update.title,
					progress: update.data,
					percentage: update.data.percentage.trim().slice(0, -1),
				};

				return;
			}

			if (update.type === StatusEvent.DownloadCancelled) {
				downloadInfo = null;
				toast.error('Download cancelled');
				return;
			}
		});

		return () => {
			ws.close();
		};
	});
</script>

<svelte:head>
	<title>Downloads</title>
</svelte:head>

<section class="flex flex-col gap-4">
	<Card title="Downloading">
		{#if downloadInfo}
			<div class="flex items-center gap-3">
				<div class="w-96">
					<img
						src="{config.assetsPath}/{downloadInfo.channelId}/videos/{downloadInfo.id}/thumbnail.png"
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
			<div>
				<span>{downloadInfo.percentage}%</span>
				<span>({downloadInfo.progress.eta} @ {downloadInfo.progress.speed})</span>
			</div>
			<progress class="progress progress-success" value={downloadInfo.percentage} max="100"
			></progress>
			<button class="btn btn-error w-min" type="button" onclick={stop}>Stop</button>
		{:else}
			None
		{/if}
	</Card>

	<Card title="Downloads ({data.videos.length}/{data.total})">
		<div class="justify-between flex">
			<div class="flex gap-2">
				<button class="btn btn-success" onclick={startDownloads}>Download</button>
				<button class="btn btn-error" {disabled} onclick={ignore}>Ignore</button>
			</div>
			<div class="flex gap-4">
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
								onclick={selectAll}
								bind:checked={allChecked}
							/>
						</label>
					</th>
					<th>Type</th>
					<th>Thumbnail</th>
					<th>Title</th>
					<th>Duration</th>
					<th>Size</th>
				</tr>
			</thead>
			<tbody>
				{#each data.videos as video (video.id)}
					<tr>
						<th>
							<label>
								<input
									name="select-video"
									type="checkbox"
									class="checkbox"
									onchange={() => {
										selectVideo(video.id);
									}}
									checked={selectedVideos.includes(video.id)}
								/>
							</label>
						</th>
						<td>
							<VideoTypeBadge type={video.type} />
						</td>
						<td>
							<div class="flex items-center gap-3">
								<div class="w-48">
									<img
										src="{config.assetsPath}/{video.channelId}/videos/{video.id}/thumbnail.png"
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
						<td>{formatDuration(video.duration ?? 0)}</td>
						<td>{formatFileSize(video.fileSize)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		{#snippet footer()}
			<Pagination count={data.videos.length} total={data.total} />
		{/snippet}
	</Card>
</section>
