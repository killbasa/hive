import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';

export async function sleep(ms: number): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function validateDirs(...dirs: string[]): Promise<void> {
	for (const dir of dirs) {
		if (!existsSync(dir)) {
			await mkdir(dir, { recursive: true });
		}
	}
}

export function stringToNum(value: string | null | undefined, fallback = 0): number {
	if (value === undefined || value === null) return fallback;

	const coerce = parseInt(value, 10);
	return isNaN(coerce) ? fallback : coerce;
}
