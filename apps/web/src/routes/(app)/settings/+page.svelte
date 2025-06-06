<script lang="ts">
	import Card from '$components/Card.svelte';
	import CardSection from '$components/CardSection.svelte';
	import NumberInput from '$components/NumberInput.svelte';
	import TextInput from '$components/TextInput.svelte';
	import { client } from '$lib/client';
	import { toast } from '$lib/stores/toasts';
	import CronPreview from '$components/misc/CronPreview.svelte';
	import type { FormEventHandler } from 'svelte/elements';
	import type { PageData } from './$types';
	import { goto, invalidate } from '$app/navigation';
	import { base } from '$app/paths';

	type CronStore = {
		checkSubscriptions: string | null;
		downloadPending: string | null;
		channelMetadata: string | null;
	};

	let {
		data,
	}: {
		data: PageData;
	} = $props();

	let auth = $state({
		password: '',
		oldPassword: '',
	});

	let schedule = $state<CronStore>({
		checkSubscriptions: data.settings.cronCheckSubscriptions,
		downloadPending: data.settings.cronDownloadPending,
		channelMetadata: data.settings.cronChannelMetadata,
	});

	let cronSelector = $state<keyof CronStore | null>(null);

	let accountUpdateDisabled: boolean = $derived(
		auth.password === '' || //
			auth.oldPassword === '' ||
			auth.password === auth.oldPassword,
	);

	let scheduleUpdateDisabled: boolean = $derived(
		schedule.checkSubscriptions === data.settings.cronCheckSubscriptions && //
			schedule.downloadPending === data.settings.cronDownloadPending,
	);

	async function handleSubmit() {
		await client.POST('/auth/logout', {
			headers: { 'Content-Type': null },
		});

		await goto(`${base}/login`);
	}

	const handleAccountUpdate: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();

		const response = await client.PATCH('/users/me', {
			body: {
				newPassword: auth.password,
				oldPassword: auth.oldPassword,
			},
		});

		if (response.response.ok) {
			await goto(`${base}/login`);
		} else {
			toast.error(response.error?.message ?? 'An error occurred');
		}
	};

	const handleScheduleUpdate: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();

		const { response } = await client.PATCH('/settings/', {
			body: {
				cronCheckSubscriptions: schedule.checkSubscriptions,
				cronDownloadPending: schedule.downloadPending,
				cronChannelMetadata: schedule.channelMetadata,
			},
		});

		if (response.ok) {
			toast.success('Settings saved');
			await invalidate('state:settings');
		} else {
			toast.error('Something went wrong');
		}
	};
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
		<span class="text-lg">User: {data.user.name}</span>

		<CardSection title="Session">
			<button onclick={handleSubmit} class=" btn btn-error w-min">Logout</button>
		</CardSection>

		<CardSection title="API key">
			<div class="join">
				<button class="btn input-bordered join-item">Copy</button>
				<input
					type="password"
					name="api-key"
					class="input input-bordered join-item focus:input-primary w-full"
					required
				/>
			</div>
		</CardSection>

		<CardSection title="Update account info">
			<form onsubmit={handleAccountUpdate} class="flex flex-col gap-2">
				<input
					type="password"
					name="new-password"
					placeholder="New password"
					class="input input-bordered focus:input-primary"
					bind:value={auth.password}
					required
				/>
				<input
					type="password"
					name="old-password"
					placeholder="Old password"
					class="input input-bordered focus:input-primary"
					bind:value={auth.oldPassword}
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
		<form onsubmit={handleScheduleUpdate} class="flex flex-col gap-2">
			<div class="grid grid-cols-2 gap-4">
				<div class="flex flex-col gap-2">
					<TextInput
						id="check-subscriptions"
						title="Check subscriptions"
						bind:value={schedule.checkSubscriptions}
						onfocus={() => (cronSelector = 'checkSubscriptions')}
						onblur={() => (cronSelector = null)}
					/>
					<TextInput
						id="download-queue"
						title="Download queue"
						bind:value={schedule.downloadPending}
						onfocus={() => (cronSelector = 'downloadPending')}
						onblur={() => (cronSelector = null)}
					/>
					<TextInput
						id="update-channels"
						title="Update channels"
						bind:value={schedule.channelMetadata}
						onfocus={() => (cronSelector = 'channelMetadata')}
						onblur={() => (cronSelector = null)}
					/>
				</div>
				<CronPreview expression={cronSelector ? schedule[cronSelector] : null} />
			</div>
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
