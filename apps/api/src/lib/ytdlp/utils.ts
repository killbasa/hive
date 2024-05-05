import { Time } from '@hive/common';

export function parseDurationString(value: string | undefined, fallback: number): number {
	if (typeof value !== 'string') {
		return fallback;
	}

	const result = value
		.split(':')
		.reverse()
		.map((e) => Number.parseInt(e, 10));

	const seconds = result.at(0) ?? 0;
	const minutes = result.at(1) ?? 0;
	const hours = result.at(2) ?? 0;

	if (Number.isNaN(seconds)) {
		return fallback;
	}

	return (hours * Time.Hour + minutes * Time.Minute + seconds * Time.Second) / 1000;
}
