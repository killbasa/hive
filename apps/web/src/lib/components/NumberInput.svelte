<script lang="ts">
	export let id: string;
	export let title: string;
	export let value: number | null = null;
	export let positive = false;

	$: if (positive && value && value < 0) {
		value = 0;
	}
</script>

<div class="flex flex-col max-w-96">
	<label for={id}>{title}</label>
	<input bind:value type="number" class="input input-bordered focus:input-primary" {id} />
</div>
