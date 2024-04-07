<script lang="ts">
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import Toast from './Toast.svelte';
	import { toast } from '$lib/stores/toasts';
</script>

<ul class="right-8 bottom-4 fixed list-none pointer-events-none z-[9999]">
	{#each $toast as item (item.id)}
		<li in:fly={item.intro} out:fly={item.intro} animate:flip={{ duration: 200 }}>
			<Toast {item} />
		</li>
	{/each}
</ul>
