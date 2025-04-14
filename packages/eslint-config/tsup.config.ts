import { defineConfig } from 'tsup';

export default [
	defineConfig({
		entryPoints: ['src/**/*.ts'],
		clean: true,
		dts: true,
		splitting: false,
		outDir: 'dist/cjs',
		format: 'cjs',
		outExtension: () => ({ js: '.cjs' }),
	}),
	defineConfig({
		entryPoints: ['src/**/*.ts'],
		clean: true,
		dts: true,
		splitting: false,
		outDir: 'dist/esm',
		format: 'esm',
	}),
];
