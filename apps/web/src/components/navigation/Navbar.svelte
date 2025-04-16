<script lang="ts">
	import { base } from '$app/paths';
	import HiveIcon from '$lib/images/HiveIcon.svelte';

	const style = 'flex h-full items-center hover:bg-slate-700';
</script>

<nav class="flex justify-center bg-slate-800 px-4 text-slate-50">
	<div class="flex w-full max-w-7xl justify-between">
		<a class="select-none p-2 text-3xl {style}" href="{base}/">
			<HiveIcon height={40} width={40} />
		</a>

		<ul class="flex flex-row">
			<a href="{base}/channels" class="text-lg px-4 {style}">
				<li>Channels</li>
			</a>
			<a href="{base}/downloads" class="text-lg px-4 {style}">
				<li>Downloads</li>
			</a>
		</ul>

		<ul class="flex flex-row">
			<a href="{base}/settings" class="text-lg px-4 {style}">
				<li>Settings</li>
			</a>
		</ul>
	</div>
</nav>
