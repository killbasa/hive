<script lang="ts">
	export let id: string;
	export let title: string;
	export let value = '';
</script>

<div class="flex flex-col max-w-96">
	<label for={id}>{title}</label>
	<input bind:value type="text" class="input input-bordered" {id} />
</div>
