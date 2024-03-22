export function getNumberParam(url: URL, key: string, fallback = 1): number {
	const value = url.searchParams.get(key);
	const coerce = value ? parseInt(value, 10) : fallback;
	return isNaN(coerce) ? fallback : coerce;
}
