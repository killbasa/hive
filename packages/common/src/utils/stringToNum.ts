export function stringToNum(value: string | null | undefined, fallback = 0): number {
	if (value === undefined || value === null) return fallback;

	const coerce = parseInt(value, 10);
	return isNaN(coerce) ? fallback : coerce;
}
