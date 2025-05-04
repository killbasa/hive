<script lang="ts">
	import { getPaginationPages, updatePage } from '$lib/navigation';
	import { stringToNum } from '$lib/utils';
	import { page } from '$app/state';

	let {
		count,
		pageSize,
		total,
	}: {
		count: number;
		pageSize: number;
		total: number;
	} = $props();

	async function toPage(page: number) {
		await updatePage((params) => {
			if (page < 1) {
				params.set('page', '1');
			} else {
				params.set('page', `${page}`);
			}
		});
	}

	let pageNumber = $derived<number>(stringToNum(page.url.searchParams.get('page'), 1));
	let lastPageNumber = $derived<number>(Math.ceil(total / pageSize));

	let pages = $derived<(number | null)[]>(
		getPaginationPages(pageNumber, lastPageNumber), //
	);

	let backDisabled = $derived<boolean>(pageNumber === 1);
	let nextDisabled = $derived<boolean>(count === 0 || total % count === 0);
</script>

<nav>
	<div class="join">
		<button
			class="join-item btn"
			disabled={backDisabled}
			onclick={() => toPage(pageNumber - 1)}
		>
			«
		</button>

		{#each pages as page, i (i)}
			{#if page === null}
				<button class="join-item btn" disabled>...</button>
			{:else}
				<button
					class="join-item btn"
					class:btn-primary={pageNumber === page}
					onclick={() => toPage(page)}
				>
					{page}
				</button>
			{/if}
		{/each}

		<button
			class="join-item btn"
			disabled={nextDisabled}
			onclick={() => toPage(pageNumber + 1)}
		>
			»
		</button>
	</div>
</nav>

<style lang="postcss">
	@reference "$lib/styles/tailwind.css";

	button {
		@apply flex items-center px-4 h-10 leading-tight border border-gray-700;
	}

	button:hover {
		@apply bg-gray-700 text-white;
	}
</style>
