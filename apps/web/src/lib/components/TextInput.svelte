<script lang="ts">
	export let id: string;
	export let title: string;
	export let value = '';
	export let placeholder = '';
</script>

<div class="flex flex-col max-w-96">
	<label for={id}>{title}</label>
	<input
		bind:value
		type="text"
		class="input input-bordered focus:input-primary"
		{id}
		{placeholder}
	/>
</div>
