/* eslint-disable @typescript-eslint/prefer-literal-enum-member */

import { existsSync } from 'node:fs';
import { mkdir, rename } from 'node:fs/promises';
import { resolve } from 'node:path';

export const enum Time {
	Second = 1000,
	Minute = 60 * Second,
	Hour = 60 * Minute,
	Day = 24 * Hour,
	Week = 7 * Day
}

export enum StatusEvent {
	DownloadCancelled = 'DownloadCancelled',
	DownloadUpdate = 'DownloadUpdate',
	ScanComplete = 'ScanComplete',
	ScanUpdate = 'ScanUpdate'
}

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
