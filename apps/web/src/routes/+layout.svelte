<script lang="ts">
	import '$lib/styles/global.css';
	import '$lib/styles/tailwind.postcss';
	import '$lib/styles/typography.css';

	import Toaster from '$components/Toaster.svelte';
</script>

<Toaster />

<main class="flex flex-col">
	<slot />
</main>
