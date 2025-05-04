<script lang="ts">
	import { base } from '$app/paths';
	import HiveIcon from '$lib/images/HiveIcon.svelte';
	import ListIcon from '@lucide/svelte/icons/list';
	import TvIcon from '@lucide/svelte/icons/tv';
	import RadarIcon from '@lucide/svelte/icons/radar';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import GearIcon from '@lucide/svelte/icons/settings';
	import LogoutIcon from '@lucide/svelte/icons/log-out';
	import { page } from '$app/state';
	import { client } from '$lib/client';
	import { goto } from '$app/navigation';

	async function logout() {
		await client.POST('/auth/logout', {
			headers: { 'Content-Type': null },
		});

		await goto(`${base}/login`);
	}
</script>

<aside
	class="bg-slate-800 min-h-screen w-content lg:w-48 sticky top-0 col-span-1 justify-between border-r border-slate-700"
>
	<div class="flex flex-col h-full justify-between">
		<div>
			<div class="m-1">
				<a class="select-none p-2 text-3xl flex h-full items-center gap-2" href="{base}/">
					<HiveIcon class="h-9 w-9" />
					<span class="hidden lg:block">Hive</span>
				</a>
			</div>

			<div class="m-1 h-px"></div>

			<ul class="w-full">
				<li>
					<a
						href="{base}/channels"
						class="sidebar-item"
						class:sidebar-active={page.url.pathname.startsWith(`${base}/channels`)}
					>
						<ListIcon />
						<span class="hidden lg:block">Channels</span>
					</a>
				</li>
				<li>
					<a
						href="{base}/streams"
						class="sidebar-item"
						class:sidebar-active={page.url.pathname.startsWith(`${base}/streams`)}
					>
						<TvIcon />
						<span class="hidden lg:block">Streams</span>
					</a>
				</li>
				<li>
					<a
						href="{base}/scans"
						class="sidebar-item"
						class:sidebar-active={page.url.pathname.startsWith(`${base}/scans`)}
					>
						<RadarIcon />
						<span class="hidden lg:block">Scans</span>
					</a>
				</li>
				<li>
					<a
						href="{base}/downloads"
						class="sidebar-item"
						class:sidebar-active={page.url.pathname.startsWith(`${base}/downloads`)}
					>
						<DownloadIcon />
						<span class="hidden lg:block">Downloads</span>
					</a>
				</li>
			</ul>
		</div>

		<ul class="w-full">
			<li>
				<a href="{base}/settings" class="sidebar-item">
					<GearIcon />
					<span class="hidden lg:block">Settings</span>
				</a>
			</li>
			<li>
				<button onclick={logout} class="sidebar-item cursor-pointer w-full">
					<LogoutIcon />
					<span class="hidden lg:block">Sign out</span>
				</button>
			</li>
		</ul>
	</div>
</aside>

<style lang="postcss">
	@reference '$lib/styles/tailwind.css';

	ul {
		@apply list-none p-0 m-0;

		li {
			@apply m-2;
		}
	}

	.sidebar-item {
		@apply flex p-2 justify-center lg:justify-start gap-2 text-slate-400 hover:text-slate-200 rounded;

		&:hover {
			@apply bg-slate-700;
		}
	}

	.sidebar-active {
		@apply bg-slate-700 text-slate-200;
	}
</style>
