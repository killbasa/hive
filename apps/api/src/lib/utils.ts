/* eslint-disable @typescript-eslint/prefer-literal-enum-member */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, rename } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Awaitable } from './types';

export const enum Time {
	Second = 1000,
	Minute = 60 * Second,
	Hour = 60 * Minute,
	Day = 24 * Hour
}

export async function sleep(ms: number): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

export function stringToNum(value: string | undefined, fallback = 0): number {
	if (value === undefined) return fallback;

	const coerce = parseInt(value, 10);
	return isNaN(coerce) ? fallback : coerce;
}

export async function spawnAsync(
	command: string,
	args: string[],
	options: {
		cwd: string;
		stdout: (data: Buffer) => Awaitable<void>;
		stderr: (data: Buffer) => Awaitable<void>;
	}
): Promise<void> {
	const child = spawn(command, args, {
		shell: false,
		...options
	});

	child.stdout.on('data', options.stdout);
	child.stderr.on('data', options.stderr);

	await new Promise<void>((resolve, reject) => {
		child.on('error', reject);

		child.on('close', (code) => {
			if (code === 0 || code === 1) {
				resolve();
			} else {
				reject(new Error(`${command} exited with code ${code}`));
			}
		});
	});
}

export async function validateDirs(...dirs: string[]): Promise<void> {
	for (const dir of dirs) {
		if (!existsSync(dir)) {
			await mkdir(dir, { recursive: true });
		}
	}
}

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
