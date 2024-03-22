<script lang="ts">
	import Card from '$components/Card.svelte';
	import TextInput from '$components/TextInput.svelte';
	import NumberInput from '$components/NumberInput.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<section class="flex flex-col gap-4">
	<Card title="Settings">
		<span>Version: {data.api}</span>
		<span>yt-dlp version: {data.ytdlp}</span>
	</Card>
	<Card title="Schedules">
		<TextInput id="check-subscriptions" title="Check subscriptions" />
		<TextInput id="download-queue" title="Download queue" />
		<div class="flex justify-end">
			<button class="btn btn-success" type="button">Save</button>
		</div>
	</Card>
	<Card title="Downloads">
		<NumberInput id="download-limit" title="Download speed limit" positive />
		<div class="flex justify-end">
			<button class="btn btn-success" type="button">Save</button>
		</div>
	</Card>
</section>
