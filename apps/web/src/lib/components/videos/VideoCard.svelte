<script lang="ts">
	import { config } from '$lib/config';
	import type { Video } from '$lib/types/api';

	export let video: Video;
	export let showIcon = false;

	const channelUrl = `${config.apiUrl}/assets/${video.channelId}`;
</script>

<div class="card border overflow-hidden">
	<a href="/watch/{video.id}">
		<div>
			<img
				src="{channelUrl}/videos/{video.id}/thumbnail.png"
				alt="Video thumbnail"
				loading="lazy"
			/>
		</div>
	</a>
	<div class="p-3 flex gap-2">
		{#if showIcon}
			<a href="/channels/{video.channelId}" class="mask mask-circle h-12 w-12 min-w-12">
				<img
					src="{config.apiUrl}/assets/{video.channelId}/assets/thumbnail.avatar_uncropped.jpg"
					alt="Channel avatar"
				/>
			</a>
		{/if}
		<span class="font-bold text-lg">{video.title}</span>
	</div>
</div>
