import type { SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';
import type { FlyParams } from 'svelte/transition';

export type SvelteToastOnPopCallback = (id?: number) => void;

export type SvelteToastCustomComponent = {
	src: SvelteComponent;
	props?: Record<string, unknown>;
	sendIdTo?: string;
};

export type SvelteToastOptions = {
	id?: number;
	message?: string;
	duration?: number;
	initial?: number;
	next?: number;
	pausable?: boolean;
	dismissable?: boolean;
	classes?: string[];
	intro?: FlyParams;
	progress?: number;
};

const defaults: SvelteToastOptions = {
	duration: 8_000,
	initial: 1,
	next: 0,
	pausable: true,
	dismissable: true,
	intro: { x: 256 }
};

function createToast() {
	const { subscribe, update } = writable<SvelteToastOptions[]>([]);

	const options: Record<string, SvelteToastOptions> = {};
	let count = 0;

	function init(target = 'default', opts: SvelteToastOptions = {}) {
		options[target] = opts;
		return options;
	}

	function push(message: string, opts: SvelteToastOptions = {}): number {
		const param: SvelteToastOptions = {
			...opts,
			message
		};

		const entry: SvelteToastOptions = {
			...defaults,
			...param,
			id: ++count
		};

		update((n) => [entry, ...n]);
		return count;
	}

	function pop(id: number) {
		update((n) => {
			if (!n.length || id === 0) return [];
			const found = id || Math.max(...n.map((i) => i.id!));
			return n.filter((i) => i.id !== found);
		});
	}

	function notify(message: string) {
		push(message, {
			classes: ['bg-gray-600', 'text-white']
		});
	}

	function success(message: string) {
		push(message, {
			classes: ['bg-green-500', 'text-white']
		});
	}

	function error(message: string) {
		push(message, {
			classes: ['bg-red-500', 'text-white']
		});
	}

	return { subscribe, pop, init, notify, success, error };
}

export const toast = createToast();
