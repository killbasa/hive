<script lang="ts">
	export let title: string;
</script>

<div class="card border">
	<slot name="figure" />
	<div class="card-body">
		<h2 class="card-title border-b">{title}</h2>
		<div class="flex flex-col gap-2">
			<slot />
		</div>
	</div>
</div>
