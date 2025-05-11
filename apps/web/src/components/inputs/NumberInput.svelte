<script lang="ts">
	let {
		id,
		title,
		value,
		positive = false,
	}: {
		id: string;
		title: string;
		value?: number;
		positive?: boolean;
	} = $props();

	$effect(() => {
		if (positive && value && value < 0) {
			value = 0;
		}
	});
</script>

<div class="flex flex-col max-w-96">
	<label for={id}>{title}</label>
	<input bind:value type="number" class="input input-bordered focus:input-primary" {id} />
</div>
