import { resolve } from 'node:path';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			out: 'dist',
		}),
		alias: {
			$components: resolve('./src/lib/components'),
			$hooks: resolve('./src/hooks'),
			$api: resolve('./src/api.d.ts'),
		},
	},
};

export default config;
