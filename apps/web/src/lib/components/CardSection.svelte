<script lang="ts">
	export let title: string;
</script>

<h3 class="font-semibold text-lg mb-0 mt-2">{title}</h3>
<div class="flex flex-col gap-2">
	<slot />
</div>
