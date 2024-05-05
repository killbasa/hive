import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';

export async function validateDirs(...dirs: string[]): Promise<void> {
	for (const dir of dirs) {
		if (!existsSync(dir)) {
			await mkdir(dir, { recursive: true });
		}
	}
}

export async function sleep(ms: number): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, ms));
}
