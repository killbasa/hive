<script lang="ts">
	import { base } from '$app/paths';
	import GearIcon from '$components/GearIcon.svelte';
	import HiveIcon from '$lib/images/HiveIcon.svelte';

	const style = 'flex h-full items-center hover:bg-slate-700';
</script>

<nav class="flex justify-center bg-slate-800 px-4 text-slate-50 sticky top-0 z-10">
	<div class="flex w-full justify-between">
		<a class="select-none p-2 text-3xl {style}" href="{base}/">
			<HiveIcon height={40} width={40} />
		</a>

		<ul class="flex flex-row">
			<a href="{base}/settings" class="px-4 {style}">
				<li>
					<GearIcon />
				</li>
			</a>
		</ul>
	</div>
</nav>
