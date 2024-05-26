<script lang="ts">
	import { config } from '$lib/config';
	import type { Video } from '$lib/types/videos';

	export let video: Video;
	export let showIcon = false;

	const channelUrl = `${config.apiUrl}/assets/${video.channelId}`;
</script>

<div class="card border overflow-hidden rounded-lg">
	<a href="/watch/{video.id}">
		<div class="flex flex-col">
			<img
				src="{channelUrl}/videos/{video.id}/thumbnail.png"
				alt="Video thumbnail"
				loading="lazy"
			/>
			{#if video.watchProgress > 0}
				<progress
					class="progress-primary h-2"
					value={Math.floor(video.watchProgress)}
					max={video.duration}
				/>
			{/if}
		</div>
	</a>
	<div class="p-2 flex gap-2">
		{#if showIcon}
			<a href="/channels/{video.channelId}" class="mask mask-circle h-12 w-12 min-w-12">
				<img
					src="{config.apiUrl}/assets/{video.channelId}/assets/avatar.jpg"
					alt="Channel avatar"
				/>
			</a>
		{/if}
		<span class="font-bold text-lg">{video.title}</span>
	</div>
</div>

<style lang="postcss">
	progress {
		--rounded-box: 0;
	}
</style>
