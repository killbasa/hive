<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import SearchInput from '$components/SearchInput.svelte';
	import VideoStatusBadge from '$components/videos/VideoTypeBadge.svelte';
	import { config } from '$lib/config';
	import { formatDuration, formatFileSize } from '$lib/utils';
	import Paginator from '$components/navigation/Paginator.svelte';
	import type { PageData } from './$types';

	let {
		data,
	}: {
		data: PageData;
	} = $props();

	let downloads = $derived(data.videos);
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<Card.Root>
	<Card.Header>
		<Card.Title>Downloads ({downloads.length}/{data.total})</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="justify-end flex">
			<div>
				<SearchInput placeholder="Filter videos" />
			</div>
		</div>
		<table class="table">
			<thead>
				<tr>
					<th>Type</th>
					<th>Thumbnail</th>
					<th>Title</th>
					<th>Duration</th>
					<th>Size</th>
				</tr>
			</thead>
			<tbody>
				{#each downloads as video (video.id)}
					<tr>
						<td>
							<VideoStatusBadge type={video.type} />
						</td>
						<td>
							<div class="flex items-center gap-3">
								<div class="w-48">
									<img
										src="{config.apiUrl}/assets/{video.channelId}/videos/{video.id}/thumbnail.png"
										alt="Video thumbnail"
										loading="lazy"
									/>
								</div>
							</div>
						</td>
						<td>
							<a
								class="font-bold"
								target="_blank"
								href="https://www.youtube.com/watch?v={video.id}"
							>
								{video.title}
							</a>
						</td>
						<td>{formatDuration(video.duration ?? 0)}</td>
						<td>{formatFileSize(video.fileSize)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</Card.Content>
	<Card.Footer>
		<Paginator perPage={24} total={data.total} />
	</Card.Footer>
</Card.Root>
