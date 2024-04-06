<script lang="ts">
	import { updatePage } from '$lib/navigation';
	import { debounce } from '$lib/utils';

	export let placeholder: string;
	export let delay = 250;
	export let defaultFilter = '';

	let filterValue = defaultFilter;
	let input: HTMLInputElement;

	const handleFilter = debounce(async () => {
		await updatePage(
			(params) => {
				if (filterValue === '' && params.has('search')) {
					params.delete('search');
				} else {
					params.set('search', filterValue);
				}
			},
			{ noScroll: true }
		);

		input.focus();
	}, delay);
</script>

<input
	type="text"
	class="input input-bordered"
	{placeholder}
	bind:value={filterValue}
	on:input={handleFilter}
	bind:this={input}
/>
