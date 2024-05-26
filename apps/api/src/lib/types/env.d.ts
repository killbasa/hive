/* eslint-disable @typescript-eslint/consistent-type-definitions */

declare global {
	namespace NodeJS {
		export interface ProcessEnv {
			npm_package_version: string;
		}
	}
}

export type {};
