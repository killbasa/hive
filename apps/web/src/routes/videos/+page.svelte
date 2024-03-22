<script lang="ts">
	import { page } from '$app/stores';
	import Card from '$components/Card.svelte';
	import { config } from '$lib/config';
	import { updatePage } from '$lib/navigation';
	import { stringToNum } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	async function toPage(diff: number) {
		await updatePage((params) => {
			const result = pageNumber + diff;
			if (result < 1) {
				params.set('page', '1');
			} else {
				params.set('page', `${result}`);
			}
		});
	}

	let pages: { label: string; value: number; disabled: boolean; current: boolean }[];
	$: pages = [-2, -1, 0, 1, 2].map((entry) => {
		let result = pageNumber + entry;

		return {
			label: result < 1 ? '0' : `${result}`,
			value: entry,
			current: result === pageNumber,
			disabled: result === pageNumber
		};
	});

	$: pageNumber = stringToNum($page.url.searchParams.get('page'), 1);
</script>

<svelte:head>
	<title>Videos</title>
</svelte:head>

<section>
	<Card title="Videos">
		<div class="grid grid-cols-3 gap-4">
			{#each data.videos as video, i (i)}
				<div class="card border overflow-hidden">
					<a href="/watch/{video.id}">
						<img
							src="http://{config.apiUrl}/assets/{video.channelId}/videos/{video.id}/thumbnail.png"
							alt="Video thumbnail"
						/>
					</a>
					<a target="_blank" href="https://www.youtube.com/watch?v={video.id}">
						{video.title}
					</a>
				</div>
			{/each}
		</div>
		<div class="card-actions justify-center">
			<nav>
				<ul class="inline-flex -space-x-px text-base h-10">
					<li>
						<button
							class="rounded-s-lg bg-gray-800 text-gray-400"
							on:click={() => toPage(-1)}
						>
							Previous
						</button>
					</li>
					{#each pages as entry}
						<li>
							<button
								class:btn-disabled={entry.disabled}
								class={entry.current
									? 'bg-primary text-white'
									: 'bg-gray-800 text-gray-400'}
								disabled={entry.current || entry.disabled}
								on:click={() => toPage(entry.value)}
							>
								{entry.label}
							</button>
						</li>
					{/each}
					<li>
						<button
							class="rounded-e-lg bg-gray-800 text-gray-400"
							on:click={() => toPage(1)}
						>
							Next
						</button>
					</li>
				</ul>
			</nav>
		</div>
	</Card>
</section>

<style lang="postcss">
	button {
		@apply flex items-center px-4 h-10 leading-tight border border-gray-700;
	}

	button:hover {
		@apply bg-gray-700 text-white;
	}
</style>
