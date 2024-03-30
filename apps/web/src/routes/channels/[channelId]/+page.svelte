<script lang="ts">
	import { page } from '$app/stores';
	import Card from '$components/Card.svelte';
	import { config } from '$lib/config';
	import { updatePage } from '$lib/navigation';
	import { stringToNum } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	const channelUrl = `http://${config.apiUrl}/assets/${data.channel.id}`;

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
			disabled: result < 1 || result === pageNumber
		};
	});

	$: pageNumber = stringToNum($page.url.searchParams.get('page'), 1);
</script>

<svelte:head>
	<title>{data.channel.name}</title>
</svelte:head>

<section class="flex flex-col gap-4">
	<Card title={data.channel.name}>
		<svelte:fragment slot="figure">
			<figure>
				<img src="{channelUrl}/assets/thumbnail.12.jpg" alt="Channel banner" />
			</figure>
		</svelte:fragment>
		<p class="whitespace-pre-wrap">{data.channel.description}</p>
		<div class="flex gap-1 flex-wrap">
			{#each data.channel.tags.split(',') as tag}
				<span class="badge badge-neutral whitespace-nowrap">{tag}</span>
			{/each}
		</div>
	</Card>
	<Card title="Videos ({data.totalVideos})">
		<div class="grid grid-cols-3 gap-4">
			{#each data.videos as video, i (i)}
				<div class="card border overflow-hidden">
					<a href="/watch/{video.id}">
						<div>
							<img
								src="{channelUrl}/videos/{video.id}/thumbnail.png"
								class=""
								alt="Video thumbnail"
							/>
						</div>
					</a>
					<div class="p-2">
						{video.title}
					</div>
				</div>
			{/each}
		</div>
		<div class="card-actions justify-center">
			<nav>
				<ul class="inline-flex -space-x-px text-base h-10">
					<li>
						<button
							class="rounded-s-lg bg-gray-800 text-gray-400"
							class:btn-disabled={pageNumber === 1}
							class:opacity-90={pageNumber === 1}
							disabled={pageNumber === 1}
							on:click={() => toPage(-1)}
						>
							Previous
						</button>
					</li>
					{#each pages as entry}
						<li>
							<button
								class={entry.current
									? 'bg-primary text-white'
									: 'bg-gray-800 text-gray-400'}
								class:btn-disabled={entry.disabled}
								class:opacity-90={entry.disabled}
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
