<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$components/Card.svelte';
	import CardSection from '$components/CardSection.svelte';
	import NumberInput from '$components/NumberInput.svelte';
	import TextInput from '$components/TextInput.svelte';
	import { client } from '$lib/client';
	import { toast } from '$lib/stores/toasts';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';

	export let data: PageData;

	const auth = writable({
		password: '',
		oldPassword: ''
	});

	$: accountUpdateDisabled =
		$auth.password === '' || //
		$auth.oldPassword === '' ||
		$auth.password === $auth.oldPassword;

	const schedule = writable({
		checkSubscriptions: data.settings.cronSubscription,
		downloadQueue: data.settings.cronDownload
	});

	$: scheduleUpdateDisabled =
		$schedule.checkSubscriptions === data.settings.cronSubscription && //
		$schedule.downloadQueue === data.settings.cronDownload;

	async function handleSubmit() {
		await client.POST('/auth/logout');

		await goto('/login');
	}

	async function handleAccountUpdate() {
		const response = await client.PATCH('/users', {
			body: {
				newPassword: $auth.password,
				oldPassword: $auth.oldPassword
			}
		});

		if (response.response.ok) {
			await goto('/login');
		} else {
			toast.error(response.error?.message ?? 'An error occurred');
		}
	}

	async function handleScheduleUpdate() {
		const response = await client.PATCH('/settings', {
			body: {
				cronSubscription: $schedule.checkSubscriptions,
				cronDownload: $schedule.downloadQueue
			}
		});

		if (!response.response.ok) {
			toast.error('An error occurred');
		}
	}
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<section class="flex flex-col gap-4">
	<Card title="Info">
		<span>Version: {data.version.api}</span>
		<span>
			yt-dlp version:
			<a
				href="https://github.com/yt-dlp/yt-dlp/releases/tag/{data.version.ytdlp}"
				target="_blank"
				class="link-primary link"
			>
				{data.version.ytdlp}
			</a>
		</span>
	</Card>
	<Card title="Account">
		<span class="text-lg">User: {data.user.username}</span>

		<CardSection title="Session">
			<button on:click={handleSubmit} class=" btn btn-error w-min">Logout</button>
		</CardSection>

		<CardSection title="API key">
			<div class="join">
				<button class="btn input-bordered join-item">Copy</button>
				<input
					type="password"
					name="api-key"
					class="input input-bordered join-item focus:input-primary w-full"
					bind:value={$auth.password}
					required
				/>
			</div>
		</CardSection>

		<CardSection title="Update account info">
			<form on:submit|preventDefault={handleAccountUpdate} class="flex flex-col gap-2">
				<input
					type="password"
					name="new-password"
					placeholder="New password"
					class="input input-bordered focus:input-primary"
					bind:value={$auth.password}
					required
				/>
				<input
					type="password"
					name="old-password"
					placeholder="Old password"
					class="input input-bordered focus:input-primary"
					bind:value={$auth.oldPassword}
					required
				/>
				<div class="flex justify-end">
					<button class="btn btn-success" type="submit" disabled={accountUpdateDisabled}
						>Save</button
					>
				</div>
			</form>
		</CardSection>
	</Card>
	<Card title="Schedules">
		<form on:submit|preventDefault={handleScheduleUpdate} class="flex flex-col gap-2">
			<TextInput
				id="check-subscriptions"
				title="Check subscriptions"
				bind:value={$schedule.checkSubscriptions}
			/>
			<TextInput
				id="download-queue"
				title="Download queue"
				bind:value={$schedule.downloadQueue}
			/>
			<div class="flex justify-end">
				<button class="btn btn-success" type="submit" disabled={scheduleUpdateDisabled}
					>Save</button
				>
			</div>
		</form>
	</Card>
	<Card title="Downloads">
		<NumberInput id="download-limit" title="Download speed limit (KB/s)" positive />
		<div class="flex justify-end">
			<button class="btn btn-success" type="button" disabled>Save</button>
		</div>
	</Card>
	<Card title="File sharing"></Card>
</section>
