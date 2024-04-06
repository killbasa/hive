<script lang="ts">
	export let title: string | undefined = undefined;
</script>

<div class="card border">
	<slot name="figure" />
	<div class="card-body">
		{#if title}
			<h2 class="card-title border-b">{title}</h2>
		{/if}
		<div class="flex flex-col gap-2">
			<slot />
		</div>
	</div>
</div>
