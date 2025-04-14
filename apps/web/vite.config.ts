import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import type { CommonServerOptions } from 'vite';

const serverOptions: CommonServerOptions = {
	port: 3000,
	strictPort: true,
};

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	optimizeDeps: {
		entries: ['@tabler/icons-svelte', 'cron-scheduler', 'openapi-fetch', 'zod'],
	},
	server: serverOptions,
	preview: serverOptions,
	test: {
		globals: true,
		coverage: {
			provider: 'v8',
			reporter: ['text'],
			exclude: [...(configDefaults.coverage.exclude ?? []), './src/lib/components/**'],
		},
		clearMocks: true,
		mockReset: true,
	},
});
