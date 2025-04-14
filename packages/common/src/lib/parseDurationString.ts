import { Time } from '../enums.js';

export function parseDurationString(value: string | undefined): number | null {
	if (typeof value !== 'string') {
		return null;
	}

	const result = value
		.split(':')
		.reverse()
		.map((e) => Number.parseInt(e, 10));

	const seconds = result.at(0) ?? 0;
	const minutes = result.at(1) ?? 0;
	const hours = result.at(2) ?? 0;

	if (Number.isNaN(seconds)) {
		console.warn('failed to parse duration string', { value });
		return null;
	}

	return (hours * Time.Hour + minutes * Time.Minute + seconds * Time.Second) / 1000;
}
