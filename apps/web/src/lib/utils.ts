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
export function throttle(cb: (...args: any[]) => any, delay: number) {
	let wait = false;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (...args: any[]) => {
		if (wait) {
			return;
		}

		cb(...args);
		wait = true;
		setTimeout(() => {
			wait = false;
		}, delay);
	};
}
