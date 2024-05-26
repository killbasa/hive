import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import type { CommonServerOptions } from 'vite';

const serverOptions: CommonServerOptions = {
	port: 3000,
	strictPort: true,
};

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		entries: ['@tabler/icons-svelte', 'cron-parser', 'openapi-fetch', 'zod'],
	},
	server: serverOptions,
	preview: serverOptions,
});
