<script lang="ts">
	import Toast from './Toast.svelte';
	import { toast } from '$lib/stores/toasts';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { getVideoContext } from '$lib/stores/video';
	import { page } from '$app/state';
	import { base } from '$app/paths';

	const video = getVideoContext();

	let isWatchPage = $derived(page.url.pathname.startsWith(`${base}/watch`));
	let minimizedStyle = $derived.by(() => {
		if (isWatchPage || !$video) {
			return 'bottom-4';
		}
		return 'bottom-72';
	});
</script>

<ul class="right-4 fixed list-none pointer-events-none z-[9999] {minimizedStyle}">
	{#each $toast as item (item.id)}
		<li in:fly={item.intro} out:fly={item.intro} animate:flip={{ duration: 200 }}>
			<Toast {item} />
		</li>
	{/each}
</ul>
