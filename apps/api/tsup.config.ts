import { defineConfig } from 'tsup';

export default defineConfig({
	bundle: true,
	clean: true,
	dts: false,
	entry: [
		'src/main.ts', //
		'src/server.ts',
		'src/routes.ts',
		'!src/**/*.spec.ts',
		'!src/**/*.spec-util.ts',
	],
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
	env: {
		NODE_ENV: process.env.NODE_ENV ?? 'production',
		TESTING: 'false',
		npm_package_version: process.env.npm_package_version!,
		DISABLE_AUTODL: 'false',
	},
});
