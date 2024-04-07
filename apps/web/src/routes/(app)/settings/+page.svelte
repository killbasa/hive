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

	export let data: PageData;

	let newUsername = '';
	let newPassword = '';
	let oldPassword = '';
	$: disabled =
		newUsername === '' ||
		newPassword === '' ||
		oldPassword === '' ||
		newPassword === oldPassword;

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
				newUsername,
				newPassword,
				oldPassword
			})
		});

		if (response.raw.ok) {
			await goto('/login');
		} else {
			const data: { message: string } = await response //
				.json()
				.catch(() => ({ message: 'Something went wrong' }));
			toast.error(data.message);
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
					bind:value={newUsername}
				/>
				<input
					type="password"
					name="password"
					placeholder="New password"
					class="input input-bordered focus:input-primary"
					bind:value={newPassword}
				/>
				<input
					type="password"
					name="password"
					placeholder="Old password"
					class="input input-bordered focus:input-primary"
					bind:value={oldPassword}
				/>
				<div class="flex justify-end">
					<button class="btn btn-success" type="submit" {disabled}>Save</button>
				</div>
			</form>
		</CardSection>
	</Card>
	<Card title="Schedules">
		<TextInput id="check-subscriptions" title="Check subscriptions" placeholder="0 0 * * *" />
		<TextInput id="download-queue" title="Download queue" placeholder="0 1 * * *" />
		<div class="flex justify-end">
			<button class="btn btn-success" type="button" disabled>Save</button>
		</div>
	</Card>
	<Card title="Downloads">
		<NumberInput id="download-limit" title="Download speed limit (KB/s)" positive />
		<div class="flex justify-end">
			<button class="btn btn-success" type="button" disabled>Save</button>
		</div>
	</Card>
	<Card title="File sharing"></Card>
</section>
