import adapter from '@hive/adapter-fastify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			out: 'dist',
		}),
		alias: {
			$components: resolve('./src/components'),
			$hooks: resolve('./src/hooks'),
			$api: resolve('./src/api.d.ts'),
		},
		output: {
			preloadStrategy: 'modulepreload',
			bundleStrategy: 'single',
		},
		paths: {
			relative: true,
			base: '/ui',
		},
		typescript: {
			config: (cfg) => {
				cfg.include = [
					...cfg.include,
					'../src',
					'../eslint.config.js',
					'../svelte.config.js',
					'../tailwind.config.ts',
					'../vite.config.ts',
				];

				return cfg;
			},
		},
	},
};

export default config;
