import adapter from '@sveltejs/adapter-node';
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
		csp: {
			directives: process.env.IS_CONTAINER
				? {
						'default-src': ['none'], //
						'script-src-elem': ['self', 'unsafe-inline'],
						'script-src': ['self'],
						'style-src': ['self', 'unsafe-inline'],
						'font-src': ['self'],
						'connect-src': ['self'],
						'object-src': ['https://www.youtube.com'],
						'frame-src': ['https://www.youtube.com'],
						'img-src': ['self', 'data:'],
						'media-src': ['self'],
						'manifest-src': ['self'],
						'frame-ancestors': ['self', 'https://www.youtube.com'],
						'upgrade-insecure-requests': true,
					}
				: {
						'default-src': ['none'], //
						'script-src-elem': ['self', 'unsafe-inline'],
						'script-src': ['self'],
						'style-src': ['self', 'unsafe-inline'],
						'font-src': ['self'],
						'connect-src': ['self', 'http://localhost:3001', 'ws://localhost:3001'],
						'object-src': ['https://www.youtube.com'],
						'frame-src': ['https://www.youtube.com'],
						'img-src': ['self', 'data:', 'http://localhost:3001'],
						'media-src': ['self', 'http://localhost:3001'],
						'manifest-src': ['self'],
						'frame-ancestors': ['self', 'https://www.youtube.com'],
						'upgrade-insecure-requests': true,
					},
		},
	},
};

export default config;
