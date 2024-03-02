/* eslint-disable @typescript-eslint/prefer-literal-enum-member */

export async function sleep(ms: number): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

export const enum Time {
	Second = 1000,
	Minute = 60 * Second,
	Hour = 60 * Minute,
	Day = 24 * Hour
}
