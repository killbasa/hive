<script lang="ts">
	import { config } from '$lib/config';

	let {
		channelId,
		size = 12,
		...rest
	}: {
		channelId: string;
		size?: number;
		class?: string;
	} = $props();
</script>

<div class="avatar {rest.class ?? ''}">
	<div class="mask mask-circle h-{size} w-{size}">
		<img src="{config.apiUrl}/assets/{channelId}/assets/avatar.jpg" alt="Channel avatar" />
	</div>
</div>
