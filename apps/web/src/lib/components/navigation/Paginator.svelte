<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import { updatePage } from '$lib/navigation';
	import { stringToNum } from '$lib/utils';
	import { page } from '$app/state';

	let {
		perPage,
		total,
	}: {
		perPage: number;
		total: number;
	} = $props();

	let pageNumber = $derived(stringToNum(page.url.searchParams.get('page'), 1));

	async function toPage(page: number) {
		await updatePage((params) => {
			if (page < 1) {
				params.set('page', '1');
			} else {
				params.set('page', `${page}`);
			}
		});
	}
</script>

<Pagination.Root count={total} {perPage} page={pageNumber}>
	{#snippet children({ pages, currentPage })}
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton onclick={() => toPage(pageNumber - 1)} />
			</Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item>
						<Pagination.Link
							{page}
							isActive={currentPage === page.value}
							onclick={() => toPage(page.value)}
						>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				<Pagination.NextButton onclick={() => toPage(pageNumber + 1)} />
			</Pagination.Item>
		</Pagination.Content>
	{/snippet}
</Pagination.Root>
