<script lang="ts">
	export let title: string | undefined = undefined;
</script>

<div class="card border rounded-md">
	<slot name="figure" />
	<div class="card-body">
		{#if title}
			<h2 class="card-title border-b">{title}</h2>
		{/if}
		<div class="flex flex-col gap-2">
			<slot />
		</div>
	</div>
	{#if $$slots.footer}
		<div class="card-actions justify-center border-t py-4 mx-6">
			<slot name="footer" />
		</div>
	{/if}
</div>
