<script lang="ts">
	export let id: string;
	export let title: string;
	export let value: string | null = null;
	export let placeholder = '';

	$: if (value === '') {
		value = null;
	}
</script>

<div class="flex flex-col">
	<label for={id}>{title}</label>
	<input
		bind:value
		type="text"
		class="input input-bordered focus:input-primary"
		{id}
		{placeholder}
		on:focus
		on:blur
	/>
</div>
