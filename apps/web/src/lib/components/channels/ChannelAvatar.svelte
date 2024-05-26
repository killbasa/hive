<script lang="ts">
	import { config } from '$lib/config';

	export let channelId: string;
	export let size = 12;
</script>

<div class="avatar {$$restProps.class ?? ''}">
	<div class="mask mask-circle h-{size} w-{size}">
		<img src="{config.apiUrl}/assets/{channelId}/assets/avatar.jpg" alt="Channel avatar" />
	</div>
</div>
