// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(fn: T, delay: number): T {
	let wait = false;

	return function (this: unknown, ...args: Parameters<T>) {
		if (wait) return;

		fn.apply(this, args);
		wait = true;

		window.setTimeout(() => {
			wait = false;
		}, delay);
	} as T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T {
	let timeoutId: number | undefined = undefined;

	return function (this: unknown, ...args: Parameters<T>) {
		if (timeoutId !== undefined) {
			window.clearTimeout(timeoutId);
		}

		timeoutId = window.setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	} as T;
}

const UNITS = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte'];
const BYTES_PER_KB = 1000;

export function humanFileSize(sizeBytes: number | bigint): string {
	let size = Math.abs(Number(sizeBytes));

	let u = 0;
	while (size >= BYTES_PER_KB && u < UNITS.length - 1) {
		size /= BYTES_PER_KB;
		++u;
	}

	return new Intl.NumberFormat([], {
		style: 'unit',
		unit: UNITS[u],
		unitDisplay: 'short',
		maximumFractionDigits: 1
	}).format(size);
}

export function formatLinks(description: string): string {
	return description.replace(
		/(?:https|http):\/\/\S+/g,
		'<a href="$&" target="_blank" class="link link-primary">$&</a>'
	);
}
