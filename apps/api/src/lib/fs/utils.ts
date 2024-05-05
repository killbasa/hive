import { existsSync } from 'node:fs';
import { lstat, mkdir, readdir, rename } from 'node:fs/promises';
import { join, resolve } from 'node:path';

export async function mv(oldPath: string, newPath: string): Promise<void> {
	const source = resolve(oldPath);
	const target = resolve(newPath);

	await rename(source, target);
}

export async function mvDir(oldPath: string, newPath: string): Promise<void> {
	const source = resolve(oldPath);
	const target = resolve(newPath);

	if (!existsSync(target)) {
		await mkdir(target, { recursive: true });
	}

	await rename(source, target);
}

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

		await Promise.all(dir.map((directoryItem) => checkDir(join(path, directoryItem))));
	}

	await checkDir(rootPath);

	return size;
}
