<script lang="ts">
	import { invalidate } from '$app/navigation';
	import Card from '$components/Card.svelte';
	import { client } from '$lib/client';
	import { config } from '$lib/config';
	import { toast } from '$lib/stores/toasts';
	import { HiveWebSocket } from '$lib/ws';
	import { StatusEvent } from '@hive/common';
	import type { DownloadStatus } from '@hive/common';
	import { onMount } from 'svelte';

	type ScanInfo = {
		channelId: string;
		channelPos: number;
		channelTotal: number;
		videoPos: number;
		videoTotal: number;
	};

	let scanInfo: ScanInfo | null = $state(null);

	async function scan(): Promise<void> {
		const { response } = await client.POST('/videos/scan', {
			headers: { 'Content-Type': null },
		});

		if (response.ok) {
			toast.success('Video scan started');
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

			// Check channel total
			// Don't refresh if there's more channels?
			if (update.type === StatusEvent.ScanComplete) {
				scanInfo = null;
				await invalidate('state:downloads');
				return;
			}

			if (update.type === StatusEvent.ScanUpdate) {
				scanInfo = {
					channelId: update.channelId,
					channelPos: update.channelPos,
					channelTotal: update.channelTotal,
					videoPos: update.videoPos,
					videoTotal: update.videoTotal,
				};
			}
		});

		return () => {
			ws.close();
		};
	});
</script>

<svelte:head>
	{#if scanInfo}
		<title
			>Scans [V: {scanInfo.videoPos}/{scanInfo.videoTotal} C:{scanInfo.channelPos -
				1}/{scanInfo.channelTotal}]</title
		>
	{:else}
		<title>Scans</title>
	{/if}
</svelte:head>

<section class="flex flex-col gap-4">
	<Card title="Scanning">
		<button class="btn btn-success" onclick={scan}>Scan channels</button>
		{#if scanInfo}
			<div class="avatar">
				<div class="mask mask-circle h-12 w-12">
					<img
						src="{config.assetsPath}/{scanInfo.channelId}/assets/avatar.jpg"
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
				<span>{scanInfo.channelPos - 1} / {scanInfo.channelTotal}</span>
				<progress
					class="progress progress-success"
					value={scanInfo.channelPos - 1}
					max={scanInfo.channelTotal}
				></progress>
			</div>
			<div>
				<span>{scanInfo.videoPos} / {scanInfo.videoTotal}</span>
				<progress
					class="progress progress-success"
					value={scanInfo.videoPos}
					max={scanInfo.videoTotal}
				>
				</progress>
			</div>
		{:else}
			None
		{/if}
	</Card>
</section>
