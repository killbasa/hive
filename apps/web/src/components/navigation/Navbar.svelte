<script lang="ts">
	import { base } from '$app/paths';
	import GearIcon from '$components/GearIcon.svelte';
	import HiveIcon from '$lib/images/HiveIcon.svelte';

	const style = 'flex h-full items-center hover:bg-slate-700';
</script>

<nav class="flex justify-center bg-slate-800 px-4 text-slate-50">
	<div class="flex w-full max-w-7xl justify-between">
		<a class="select-none p-2 text-3xl {style}" href="{base}/">
			<HiveIcon height={40} width={40} />
		</a>

		<ul class="flex flex-row">
			<a href="{base}/channels" class="text-md px-4 {style}">
				<li>Channels</li>
			</a>
			<a href="{base}/scans" class="text-md px-4 {style}">
				<li>Scans</li>
			</a>
			<a href="{base}/downloads" class="text-md px-4 {style}">
				<li>Downloads</li>
			</a>
		</ul>

		<ul class="flex flex-row">
			<a href="{base}/settings" class="px-4 {style}">
				<li>
					<GearIcon />
				</li>
			</a>
		</ul>
	</div>
</nav>
