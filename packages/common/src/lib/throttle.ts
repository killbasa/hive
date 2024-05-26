export function throttle<T extends (...args: any[]) => any>(fn: T, delay: number): T {
	let wait = false;

	return function handle(this: unknown, ...args: Parameters<T>) {
		if (wait) {
			return;
		}

		fn.apply(this, args);
		wait = true;

		setTimeout(() => {
			wait = false;
		}, delay);
	} as T;
}
