<script lang="ts">
	import Card from '$components/Card.svelte';
	import TextInput from '$components/TextInput.svelte';
	import NumberInput from '$components/NumberInput.svelte';
	import type { PageData } from './$types';
	import { apiFetch } from '$lib/fetch';
	import { goto } from '$app/navigation';
	import CardSection from '$components/CardSection.svelte';
	import { MIMETypes } from '$lib/constants';
	import { toast } from '$lib/stores/toasts';
	import { writable } from 'svelte/store';

	export let data: PageData;

	const auth = writable({
		username: '',
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
		await apiFetch('/auth/logout', {
			fetch,
			method: 'POST'
		});

		await goto('/login');
	}

	async function handleAccountUpdate() {
		const response = await apiFetch<{ message: string }>('/users', {
			fetch,
			method: 'PATCH',
			headers: { 'content-type': MIMETypes.json },
			body: JSON.stringify({
				newUsername: $auth.username,
				newPassword: $auth.password,
				oldPassword: $auth.oldPassword
			})
		});

		if (response.raw.ok) {
			await goto('/login');
		} else {
			const err = await response.error();
			toast.error(err.message);
		}
	}

	async function handleScheduleUpdate() {
		const response = await apiFetch<{ message: string }>('/settings', {
			fetch,
			method: 'PATCH',
			headers: { 'content-type': MIMETypes.json },
			body: JSON.stringify({
				cronSubscription: $schedule.checkSubscriptions,
				cronDownload: $schedule.downloadQueue
			})
		});

		if (!response.raw.ok) {
			const err = await response.error();
			toast.error(err.message);
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

		<CardSection title="Update account info">
			<form on:submit|preventDefault={handleAccountUpdate} class="flex flex-col gap-2">
				<input
					type="text"
					name="username"
					placeholder="New username"
					class="input input-bordered focus:input-primary"
					bind:value={$auth.username}
				/>
				<input
					type="password"
					name="password"
					placeholder="New password"
					class="input input-bordered focus:input-primary"
					bind:value={$auth.password}
					required
				/>
				<input
					type="password"
					name="password"
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
		<div role="alert" class="alert alert-warning rounded-lg">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/></svg
			>
			<span>Warning: verifying the cron pattern is on you, so make sure it's sane.</span>
		</div>
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
