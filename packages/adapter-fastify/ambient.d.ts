/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */

// @ts-ignore-error - import types
/// <reference types="@sveltejs/kit/src/exports/public.d.ts" />

declare module 'ENV' {
	export function env(key: string, fallback?: any): string;
}

declare module 'MANIFEST' {
	import { SSRManifest } from '@sveltejs/kit';

	export const manifest: SSRManifest;
	export const prerendered: Set<string>;
	export const base: string;
}

declare module 'SERVER' {
	export { Server } from '@sveltejs/kit';
}

declare namespace App {
	export interface Platform {
		req: import('http').IncomingMessage;
	}
}
