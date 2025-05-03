<script lang="ts">
	import Card from '$components/Card.svelte';
	import CardSection from '$components/CardSection.svelte';
	import NumberInput from '$components/NumberInput.svelte';
	import TextInput from '$components/TextInput.svelte';
	import { client } from '$lib/client';
	import { toast } from '$lib/stores/toasts';
	import CronPreview from '$components/misc/CronPreview.svelte';
	import type { FormEventHandler, MouseEventHandler } from 'svelte/elements';
	import type { PageProps } from './$types';
	import { goto, invalidate } from '$app/navigation';
	import { base } from '$app/paths';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import XIcon from '@lucide/svelte/icons/x';

	type CronStore = {
		checkSubscriptions: string | null;
		downloadPending: string | null;
		channelMetadata: string | null;
	};

	let { data }: PageProps = $props();

	let apikey = $state('');

	let modal = $state<HTMLDialogElement>();
	let newApikeyModal = $state<HTMLDialogElement>();
	let revokeModal = $state<HTMLDialogElement>();

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

	const generateApikey: MouseEventHandler<HTMLButtonElement> = async () => {
		const response = await client.POST('/auth/apikeys/refresh');

		if (response.error) {
			toast.error('Failed to generate API key');
		} else {
			toast.success('API key generated');
			apikey = response.data.apikey;
		}

		modal?.close();
		newApikeyModal?.showModal();
	};

	const revokeApikey = async (kid: string) => {
		const response = await client.POST('/auth/apikeys/revoke', {
			body: {
				id: kid,
			},
		});

		if (response.error) {
			toast.error('Failed to revoke API key');
		} else {
			toast.success('Revoked API key');
		}

		revokeModal?.close();
	};

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
					<button class="btn btn-success" type="submit" disabled={accountUpdateDisabled}>
						Save
					</button>
				</div>
			</form>
		</CardSection>
	</Card>

	<Card title="API Keys">
		<CardSection title="Management">
			<div class="join">
				<button class="btn input-bordered btn-primary" onclick={() => modal?.showModal()}>
					Generate
				</button>

				<dialog class="modal" bind:this={modal}>
					<div class="modal-box">
						<h3 class="text-lg font-bold">Generate a new API key</h3>
						<p class="py-4">Are you sure you want to generate a new API key?</p>
						<div class="modal-action">
							<form method="dialog">
								<button class="btn">Cancel</button>
								<button
									type="button"
									class="btn btn-primary"
									onclick={generateApikey}
								>
									Confirm
								</button>
							</form>
						</div>
					</div>
				</dialog>

				<dialog class="modal" bind:this={newApikeyModal}>
					<div class="modal-box w-11/12 max-w-5xl">
						<h3 class="text-lg font-bold">New API key</h3>
						<p class="py-4">Please save this value, it will not be shown again.</p>
						<div class="bg-neutral w-full p-2 flex gap-4 items-center rounded">
							<button
								type="button"
								class="cursor-pointer p-1"
								onclick={() => {
									navigator.clipboard.writeText(apikey);
									toast.success('Copied to clipboard');
								}}
							>
								<CopyIcon />
							</button>

							<pre><code>{apikey}</code></pre>
						</div>
						<div class="modal-action">
							<form method="dialog">
								<button class="btn btn-success" onclick={() => (apikey = '')}>
									OK
								</button>
							</form>
						</div>
					</div>
				</dialog>
			</div>
		</CardSection>

		<CardSection title="Active keys">
			{#each data.apikeys as key (key.id)}
				<div class="flex items-center gap-2 p-1">
					<span>{key.id}</span>
					Expires at: {key.expires ?? 'never'}
					<button
						type="button"
						class="btn btn-error btn-sm"
						onclick={revokeModal?.showModal}
					>
						<XIcon />
					</button>

					<dialog class="modal" bind:this={revokeModal}>
						<div class="modal-box w-11/12 max-w-5xl">
							<h3 class="text-lg font-bold">Confirmation</h3>
							<p class="py-4">Are you sure you want to revoke that API key?</p>
							<div class="modal-action">
								<form method="dialog">
									<button class="btn">Cancel</button>
									<button
										type="button"
										class="btn btn-primary"
										onclick={async () => {
											await revokeApikey(key.id);
										}}
									>
										Confirm
									</button>
								</form>
							</div>
						</div>
					</dialog>
				</div>
			{/each}
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

	<Card title="Connections"></Card>

	<Card title="File sharing"></Card>
</section>
