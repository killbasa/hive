<script lang="ts">
	import '$lib/styles/global.css';
	import '$lib/styles/tailwind.postcss';
	import '$lib/styles/typography.css';

	import Navbar from '$components/Navbar.svelte';
</script>

<div class="flex flex-col">
	<Navbar />
	<div class="flex min-h-screen flex-col justify-between p-[7rem,2rem,2rem,4rem]">
		<div class="mx-auto w-full max-w-7xl px-8 py-8 xl:px-0">
			<slot />
		</div>
	</div>
</div>
