import { defineConfig } from 'tsup';

export default defineConfig({
	bundle: true,
	clean: true,
	dts: false,
	entry: [
		'src/server.ts', //
		'!src/**/*.spec.ts',
		'!src/**/*.test-util.ts',
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
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		npm_package_version: process.env.npm_package_version!,
	},
});
