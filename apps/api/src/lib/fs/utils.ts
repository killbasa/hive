import { existsSync } from 'node:fs';
import { lstat, mkdir, readdir, rename } from 'node:fs/promises';
import { join, resolve } from 'node:path';

/**
 * Move a file or directory from one location to another, creating parent directories if needed.
 */
export async function mv(currentPath: string, newPath: string): Promise<void> {
	const source = resolve(currentPath);
	const target = resolve(newPath);

	if (!existsSync(target)) {
		const parent = resolve(target, '..');
		await mkdir(parent, { recursive: true });
	}

	await rename(source, target);
}

/**
 * Calculates the total size of a directory and its contents recursively.
 *
 * @param rootPath - The path to the directory or file to calculate the size for
 *
 * @example
 * ```typescript
 * const size = await du('/path/to/directory');
 * console.log(size); // Prints total size in bytes
 * ```
 */
export async function du(rootPath: string): Promise<bigint> {
	if (!existsSync(rootPath)) {
		return 0n;
	}

	let size = 0n;

	async function checkDir(path: string): Promise<void> {
		const stats = await lstat(path, { bigint: true });
		size += stats.size;

		if (stats.isFile()) {
			return;
		}

		const dir = await readdir(path);

		await Promise.all(
			// eslint-disable-next-line @typescript-eslint/promise-function-async
			dir.map((directoryItem) => {
				return checkDir(join(path, directoryItem));
			}),
		);
	}

	await checkDir(rootPath);

	return size;
}
