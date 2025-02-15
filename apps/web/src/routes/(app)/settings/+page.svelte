<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import CardSection from '$components/CardSection.svelte';
	import { client } from '$lib/client';
	import { toast } from '$lib/stores/toasts';
	import CronPreview from '$lib/components/misc/CronPreview.svelte';
	import Input from '$components/ui/input/input.svelte';
	import Button from '$components/ui/button/button.svelte';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';
	import type { FormEventHandler } from 'svelte/elements';
	import { goto, invalidate } from '$app/navigation';

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

	const auth = writable({
		password: '',
		oldPassword: '',
	});

	const schedule = writable<CronStore>({
		checkSubscriptions: data.settings.cronCheckSubscriptions,
		downloadPending: data.settings.cronDownloadPending,
		channelMetadata: data.settings.cronChannelMetadata,
	});

	const cronSelector = writable<keyof CronStore | null>(null);

	let accountUpdateDisabled: boolean = $derived(
		$auth.password === '' || //
			$auth.oldPassword === '' ||
			$auth.password === $auth.oldPassword,
	);

	let scheduleUpdateDisabled: boolean = $derived(
		$schedule.checkSubscriptions === data.settings.cronCheckSubscriptions && //
			$schedule.downloadPending === data.settings.cronDownloadPending,
	);

	async function handleSubmit() {
		await client.POST('/auth/logout', {
			headers: { 'Content-Type': null },
		});

		await goto('/login');
	}

	const handleAccountUpdate: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();

		const response = await client.PATCH('/users', {
			body: {
				newPassword: $auth.password,
				oldPassword: $auth.oldPassword,
			},
		});

		if (response.response.ok) {
			await goto('/login');
		} else {
			toast.error(response.error?.message ?? 'An error occurred');
		}
	};

	const handleScheduleUpdate: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();

		const { response } = await client.PATCH('/settings', {
			body: {
				cronCheckSubscriptions: $schedule.checkSubscriptions,
				cronDownloadPending: $schedule.downloadPending,
				cronChannelMetadata: $schedule.channelMetadata,
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
	<Card.Root>
		<Card.Header>
			<Card.Title>Info</Card.Title>
		</Card.Header>
		<Card.Content>
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
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Title>Account</Card.Title>
		</Card.Header>
		<Card.Content>
			<span class="text-lg">User: {data.user.name}</span>

			<CardSection title="Session">
				<Button onclick={handleSubmit} class=" btn btn-error w-min">Logout</Button>
			</CardSection>

			<CardSection title="API key">
				<div class="join">
					<Button class="btn input-bordered join-item">Copy</Button>
					<Input
						type="password"
						name="api-key"
						class="input input-bordered join-item focus:input-primary w-full"
						bind:value={$auth.password}
						required
					/>
				</div>
			</CardSection>

			<CardSection title="Update account info">
				<form onsubmit={handleAccountUpdate} class="flex flex-col gap-2">
					<Input
						type="password"
						name="new-password"
						placeholder="New password"
						class="input input-bordered focus:input-primary"
						bind:value={$auth.password}
						required
					/>
					<Input
						type="password"
						name="old-password"
						placeholder="Old password"
						class="input input-bordered focus:input-primary"
						bind:value={$auth.oldPassword}
						required
					/>
					<div class="flex justify-end">
						<button
							class="btn btn-success"
							type="submit"
							disabled={accountUpdateDisabled}>Save</button
						>
					</div>
				</form>
			</CardSection>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Title>Schedules</Card.Title>
		</Card.Header>
		<Card.Content>
			<form onsubmit={handleScheduleUpdate} class="flex flex-col gap-2">
				<div class="grid grid-cols-2 gap-4">
					<div class="flex flex-col gap-2">
						<Input
							id="check-subscriptions"
							title="Check subscriptions"
							bind:value={$schedule.checkSubscriptions}
							onfocus={() => cronSelector.set('checkSubscriptions')}
							onblur={() => cronSelector.set(null)}
						/>
						<Input
							id="download-queue"
							title="Download queue"
							bind:value={$schedule.downloadPending}
							onfocus={() => cronSelector.set('downloadPending')}
							onblur={() => cronSelector.set(null)}
						/>
						<Input
							id="update-channels"
							title="Update channels"
							bind:value={$schedule.channelMetadata}
							onfocus={() => cronSelector.set('channelMetadata')}
							onblur={() => cronSelector.set(null)}
						/>
					</div>
					<CronPreview expression={$cronSelector ? $schedule[$cronSelector] : null} />
				</div>
				<div class="flex justify-end">
					<Button class="btn btn-success" type="submit" disabled={scheduleUpdateDisabled}
						>Save</Button
					>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Title>Downloads</Card.Title>
		</Card.Header>
		<Card.Content>
			<Input id="download-limit" title="Download speed limit (KB/s)" type="number" />
			<div class="flex justify-end">
				<Button class="btn btn-success" type="button" disabled>Save</Button>
			</div>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Title>File sharing</Card.Title>
		</Card.Header>
	</Card.Root>
</section>
