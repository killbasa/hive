import { parseDurationString } from '@hive/common';

const UNITS = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte'];
const BYTES_PER_KB = 1000;

export function humanFileSize(sizeBytes: number | bigint | string): string {
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
		maximumFractionDigits: 1,
	}).format(size);
}

export function formatLinks(text: string): string {
	text = text.replaceAll(
		/^(?:https|http):\/\/\S+$/g,
		'<a href="$&" target="_blank" class="link link-primary">$&</a>',
	);

	text = text.replaceAll(
		/^#(\w+)$/g,
		'<a href="https://www.youtube.com/hashtag/$1" target="_blank" class="link link-primary">$&</a>',
	);

	text = text.replaceAll(
		/^@(\w+)$/g,
		'<a href="https://www.youtube.com/@$1" target="_blank" class="link link-primary">$&</a>',
	);

	return text;
}

export function formatTimestamps(videoId: string, text: string): string {
	const timestamps = text.match(/(\d{1,2}:\d{2}:?\d{0,2})/g);

	if (timestamps) {
		for (const timestamp of timestamps) {
			const seconds = parseDurationString(timestamp);

			text = text.replace(
				new RegExp(`^${timestamp}$`, 'g'), //
				`<a href="/ui/watch/${videoId}?t=${seconds}" class="link link-primary">${timestamp}</a>`,
			);
		}
	}

	return text;
}

export function formatDuration(value: string | number) {
	if (typeof value === 'string') {
		value = Number.parseInt(value, 10);
	}

	const hours = Math.floor(value / 3600);
	const minutes = `${Math.floor((value % 3600) / 60)}`.padStart(2, '0');
	const seconds = `${Math.floor(value % 60)}`.padStart(2, '0');

	return `${hours === 0 ? '' : `${hours}:`}${minutes}:${seconds}`;
}

export function formatFileSize(value: number | null): string {
	if (value === null) {
		return 'N/A';
	}

	const num = BigInt(value);
	return humanFileSize(num);
}

export function stringToNum(value: string | null | undefined, fallback = 0): number {
	if (value === undefined || value === null) {
		return fallback;
	}

	const coerce = Number.parseInt(value, 10);
	return Number.isNaN(coerce) ? fallback : coerce;
}
