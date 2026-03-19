import { existsSync } from 'node:fs';
import { access, constants, mkdir } from 'node:fs/promises';

export async function validateDirs(...dirs: string[]): Promise<void> {
	const errors: string[] = [];

	for (const dir of dirs) {
		if (!existsSync(dir)) {
			await mkdir(dir, { recursive: true });
		}

		const canAccess = await access(dir, constants.R_OK | constants.W_OK).catch(() => null);
		if (canAccess === null) {
			errors.push(`directory ${dir} does not have the correct permissions`);
		}
	}

	if (errors.length > 0) {
		throw new Error(errors.join('\n'));
	}
}
