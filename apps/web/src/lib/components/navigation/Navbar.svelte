<script lang="ts">
	const links = [
		{ name: 'Channels', path: '/channels' },
		{ name: 'Downloads', path: '/downloads' },
		{ name: 'Stats', path: '/stats' }
	];

	const itemStyle = 'flex h-full items-center hover:bg-slate-700';
</script>

<nav class="flex justify-center bg-slate-800 px-4 text-slate-50">
	<div class="flex w-full max-w-7xl justify-between">
		<a class="select-none p-3 text-3xl {itemStyle}" href="/">Hive</a>

		<ul class="flex flex-row">
			{#each links as link, i (i)}
				<a href={link.path} class="text-lg px-4 {itemStyle}">
					<li>{link.name}</li>
				</a>
			{/each}
		</ul>

		<div>
			<a href="/settings" class="text-lg px-4 {itemStyle}"> Settings </a>
		</div>
	</div>
</nav>
