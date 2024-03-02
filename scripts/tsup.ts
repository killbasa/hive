import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export function tsupConfig(options?: Options): ReturnType<typeof defineConfig> {
	return defineConfig({
		bundle: true,
		clean: true,
		dts: false,
		entry: ['src/index.ts'],
		format: ['esm'],
		keepNames: true,
		minify: false,
		shims: false,
		skipNodeModulesBundle: true,
		splitting: false,
		sourcemap: true,
		target: 'esnext',
		treeshake: true,
		tsconfig: './tsconfig.json',
		...options
	});
}
