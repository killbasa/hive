<script lang="ts">
	import { config } from '$lib/config';
	import * as Avatar from '$lib/components/ui/avatar/index.js';

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

<Avatar.Root class="flex h-{size} w-{size} {rest}">
	<Avatar.Image src="{config.apiUrl}/assets/{channelId}/assets/avatar.jpg" alt="Channel avatar" />
</Avatar.Root>
