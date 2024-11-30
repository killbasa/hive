<script lang="ts">
	import { updatePage } from '$lib/navigation';
	import { debounce } from '@hive/common';
	import type { FormEventHandler } from 'svelte/elements';
	import { page } from '$app/stores';

	let {
		placeholder,
		delay = 250,
	}: {
		placeholder: string;
		delay?: number;
	} = $props();

	let input: HTMLInputElement;
	let filterValue = $state($page.url.searchParams.get('search') ?? '');

	const handleFilter: FormEventHandler<HTMLInputElement> = debounce(async () => {
		await updatePage(
			(params) => {
				if (filterValue === '' && params.has('search')) {
					params.delete('search');
				} else {
					params.set('search', filterValue);
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
	bind:value={filterValue}
	oninput={handleFilter}
	bind:this={input}
/>
