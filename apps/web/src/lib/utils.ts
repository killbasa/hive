export enum StatusEvent {
	DownloadCancelled = 'DownloadCancelled',
	DownloadUpdate = 'DownloadUpdate',
	ScanComplete = 'ScanComplete',
	ScanUpdate = 'ScanUpdate'
}

export function stringToNum(value: string | undefined | null, fallback = 0): number {
	if (value === undefined || value === null) return fallback;

	const coerce = parseInt(value, 10);
	return isNaN(coerce) ? fallback : coerce;
}

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
