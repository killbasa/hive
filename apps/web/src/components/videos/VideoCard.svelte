<script lang="ts">
	import { base } from '$app/paths';
	import { config } from '$lib/config';
	import type { Video } from '$lib/types/videos';

	let {
		video,
		showIcon = false,
	}: {
		video: Video;
		showIcon?: boolean;
	} = $props();

	const channelUrl = `${config.assetsPath}/${video.channelId}`;
</script>

<div class="card border overflow-hidden rounded-lg border-slate-500">
	<a href="{base}/watch/{video.id}">
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
				></progress>
			{/if}
		</div>
	</a>
	<div class="p-2 flex gap-2">
		{#if showIcon}
			<a href="{base}/channels/{video.channelId}" class="mask mask-circle h-12 w-12 min-w-12">
				<img
					src="{config.assetsPath}/{video.channelId}/assets/avatar.jpg"
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
