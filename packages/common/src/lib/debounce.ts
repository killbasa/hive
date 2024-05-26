export function debounce<T extends (...args: any[]) => unknown>(fn: T, delay: number): T {
	let timeoutId: any = undefined;

	return function func(this: unknown, ...args: Parameters<T>) {
		if (timeoutId !== undefined) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	} as T;
}
