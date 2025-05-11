<script lang="ts">
	import { updatePage } from '$lib/navigation';
	import { debounce } from '@hive/common';
	import type { FormEventHandler } from 'svelte/elements';
	import { page } from '$app/state';

	let {
		placeholder,
		delay = 250,
	}: {
		placeholder: string;
		delay?: number;
	} = $props();

	let input: HTMLInputElement;
	let searchParam = $derived(page.url.searchParams.get('search') ?? '');

	const handleFilter: FormEventHandler<HTMLInputElement> = debounce(async () => {
		await updatePage(
			(params) => {
				params.delete('page');

				if (searchParam === '' && params.has('search')) {
					params.delete('search');
				} else {
					params.set('search', searchParam);
				}
			},
			{ noScroll: true },
		);

		input.focus();
	}, delay);
</script>

<input
	type="text"
	class="input input-bordered focus:input-primary"
	{placeholder}
	bind:value={searchParam}
	oninput={handleFilter}
	bind:this={input}
/>
