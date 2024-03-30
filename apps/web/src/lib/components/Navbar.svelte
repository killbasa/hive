<script lang="ts">
	const links = [
		{ name: 'Dashboard', path: '/' },
		{ name: 'Channels', path: '/channels' },
		{ name: 'Downloads', path: '/downloads' },
		{ name: 'Settings', path: '/settings' }
	];
</script>

<nav class="flex justify-center bg-slate-800 px-4 text-slate-50">
	<div class="flex w-full max-w-7xl justify-between">
		<span class="select-none p-3 text-3xl">Hive</span>

		<ul class="flex flex-row">
			{#each links as link, i (i)}
				<a
					href={link.path}
					class="flex h-full items-center px-4 text-lg hover:bg-slate-700"
				>
					<li>{link.name}</li>
				</a>
			{/each}
		</ul>

		<div></div>
	</div>
</nav>
