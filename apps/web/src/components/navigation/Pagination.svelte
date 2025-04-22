<script lang="ts">
	import { updatePage } from '$lib/navigation';
	import { stringToNum } from '$lib/utils';
	import { page } from '$app/state';

	let {
		count,
		total,
	}: {
		count: number;
		total: number;
	} = $props();

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

	let pages = $derived<{ label: string; value: number; disabled: boolean; current: boolean }[]>(
		[-2, -1, 0, 1, 2].map((entry) => {
			const result = pageNumber + entry;

			return {
				label: result < 1 ? '' : `${result}`,
				value: entry,
				current: result === pageNumber,
				disabled: result < 1 || count * pageNumber === total || result === pageNumber,
			};
		}),
	);

	let pageNumber = $derived(stringToNum(page.url.searchParams.get('page'), 1));
	let backDisabled = $derived(pageNumber === 1);
	let nextDisabled = $derived(count === 0 || total % count === 0);
</script>

<nav>
	<ul class="inline-flex -space-x-px text-base h-10">
		<li>
			<button
				class="rounded-s-lg bg-gray-800 text-gray-400"
				class:btn-disabled={backDisabled}
				class:opacity-90={backDisabled}
				disabled={backDisabled}
				onclick={() => toPage(-1)}
			>
				Previous
			</button>
		</li>
		{#each pages as entry}
			<li>
				<button
					class="min-w-12 flex justify-center {entry.current
						? 'bg-primary text-white'
						: 'bg-gray-800 text-gray-400'}"
					class:btn-disabled={entry.disabled}
					class:opacity-90={entry.disabled}
					disabled={entry.current || entry.disabled}
					onclick={() => toPage(entry.value)}
				>
					{entry.label}
				</button>
			</li>
		{/each}
		<li>
			<button
				class="rounded-e-lg bg-gray-800 text-gray-400"
				class:btn-disabled={nextDisabled}
				class:opacity-90={nextDisabled}
				disabled={nextDisabled}
				onclick={() => toPage(1)}
			>
				Next
			</button>
		</li>
	</ul>
</nav>

<style lang="postcss">
	@reference "tailwindcss";

	button {
		@apply flex items-center px-4 h-10 leading-tight border border-gray-700;
	}

	button:hover {
		@apply bg-gray-700 text-white;
	}
</style>
