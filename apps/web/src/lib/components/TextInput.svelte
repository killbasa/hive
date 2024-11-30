<script lang="ts">
	import type { FormEventHandler } from 'svelte/elements';

	let {
		id,
		title,
		value = $bindable(null),
		placeholder = '',
		onfocus,
		onblur,
	}: {
		id: string;
		title: string;
		value: string | null;
		placeholder?: string;
		onfocus?: FormEventHandler<HTMLInputElement>;
		onblur?: FormEventHandler<HTMLInputElement>;
	} = $props();

	$effect(() => {
		if (value === null) {
			value = '';
		}
	});
</script>

<div class="flex flex-col">
	<label for={id}>{title}</label>
	<input
		bind:value
		type="text"
		class="input input-bordered focus:input-primary"
		{id}
		{placeholder}
		{onfocus}
		{onblur}
	/>
</div>
