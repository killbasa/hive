import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

const options: Options = {
	bundle: true,
	clean: true,
	dts: false,
	format: ['esm'],
	keepNames: true,
	minify: false,
	shims: false,
	skipNodeModulesBundle: true,
	splitting: false,
	sourcemap: true,
	target: 'esnext',
	treeshake: true,
	outDir: 'dist',
	tsconfig: './tsconfig.json',
	noExternal: ['@hive/common'],
	env: {
		NODE_ENV: process.env.NODE_ENV ?? 'production',
		TESTING: 'false',
		npm_package_version: process.env.npm_package_version!,
		DISABLE_AUTODL: 'false',
	},
};

const entry: string[] = [
	'src/main.ts', //
	'!src/**/*.spec.ts',
	'!src/**/*.spec-util.ts',
];

if (process.env.NODE_ENV === 'development') {
	entry.push(
		'src/routes.ts', //
		'src/server.ts',
	);
}

export default defineConfig({
	...options,
	entry,
});
