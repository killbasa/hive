<script lang="ts">
	import { updatePage } from '$lib/navigation';
	import { debounce } from '@hive/common';
	import { page } from '$app/stores';

	export let placeholder: string;
	export let delay = 250;

	let input: HTMLInputElement;
	$: filterValue = $page.url.searchParams.get('search') ?? '';

	const handleFilter = debounce(async () => {
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
	on:input={handleFilter}
	bind:this={input}
/>
