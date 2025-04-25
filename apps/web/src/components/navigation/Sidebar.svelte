<script lang="ts">
	import { base } from '$app/paths';
	import HiveIcon from '$lib/images/HiveIcon.svelte';
	import GearIcon from '@lucide/svelte/icons/settings';
</script>

<aside
	class="bg-slate-800 min-h-screen w-64 sticky top-0 col-span-1 justify-between border-r border-slate-700"
>
	<div class="flex flex-col h-full justify-between">
		<div>
			<div>
				<a class="select-none p-2 text-3xl flex h-full items-center gap-2" href="{base}/">
					<HiveIcon height={40} width={40} />
					<span>Hive</span>
				</a>
			</div>

			<div class="m-1 h-px"></div>

			<ul class="menu w-full">
				<li>
					<a href="{base}/channels">Channels</a>
				</li>
				<li>
					<a href="{base}/scans">Scans</a>
				</li>
				<li>
					<a href="{base}/downloads">Downloads</a>
				</li>
			</ul>
		</div>

		<ul class="menu w-full">
			<li>
				<a href="{base}/settings">
					<GearIcon /><span>Settings</span>
				</a>
			</li>
		</ul>
	</div>
</aside>

<style lang="postcss">
	@reference "$lib/styles/tailwind.css";
</style>
