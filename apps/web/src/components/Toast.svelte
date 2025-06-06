<script lang="ts">
	import { toast } from '$lib/stores/toasts';
	import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';
	import type { SvelteToastOptions } from '$lib/stores/toasts';
	import type { FormEventHandler } from 'svelte/elements';

	let {
		item,
	}: {
		item: SvelteToastOptions;
	} = $props();

	let next = item.initial;
	let prev = next;
	let paused = false;

	const progress = tweened(item.initial, { duration: item.duration, easing: linear });

	function close() {
		toast.pop(item.id!);
	}

	function autoclose() {
		if ($progress === 1 || $progress === 0) close();
	}

	const pause: FormEventHandler<HTMLDivElement> = () => {
		if (!item.pausable) return;

		if (!paused && $progress !== next) {
			progress.set($progress, { duration: 0 });
			paused = true;
		}
	};

	const resume: FormEventHandler<HTMLDivElement> = () => {
		const { duration } = item;

		if (paused && next !== undefined && prev !== undefined && duration) {
			progress
				.set(next, {
					duration: duration - duration * (($progress - prev) / (next - prev)),
				})
				.then(autoclose);

			paused = false;
		}
	};

	$effect(() => {
		if (next !== item.next) {
			next = item.next;
			prev = $progress;
			paused = false;

			if (next !== undefined) progress.set(next).then(autoclose);
		}
	});

	$effect(() => {
		if (item.progress !== undefined) {
			item.next = item.progress;
		}
	});
</script>

<div
	role="status"
	class="toast-item {item.classes?.join(' ')}"
	class:pointer-events-auto={item.pausable}
	onmouseenter={pause}
	onmouseleave={resume}
>
	<div class="flex-1 my-3 mx-2">
		{item.message}
	</div>
	<button class="w-8 h-full pointer-events-auto" onclick={close}>✕</button>
	<progress class="progress-bar" value={$progress}></progress>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.toast-item {
		@apply w-80 flex mb-2 items-center will-change-transform rounded-lg overflow-hidden min-h-14 h-auto;
	}

	.progress-bar {
		@apply top-auto right-auto bottom-0 left-0 h-[6px] w-full absolute border-none bg-transparent pointer-events-none appearance-none;
	}
	.progress-bar::-webkit-progress-bar {
		@apply bg-transparent;
	}
	.progress-bar::-webkit-progress-value {
		background: rgba(33, 150, 243, 0.75);
	}
	.progress-bar::-moz-progress-bar {
		background: rgba(33, 150, 243, 0.75);
	}
</style>
