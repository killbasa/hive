import { defineConfig } from 'tsup';

export default defineConfig({
	bundle: true,
	clean: true,
	dts: false,
	entry: ['src/server.ts'],
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
		NODE_ENV: process.env.NODE_ENV ?? 'production'
	}
});
