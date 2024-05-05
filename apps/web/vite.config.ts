import { sveltekit } from '@sveltejs/kit/vite';
import { type CommonServerOptions, defineConfig } from 'vite';

const serverOptions: CommonServerOptions = {
	port: 3000,
	strictPort: true,
};

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		entries: ['zod', 'openapi-fetch'],
	},
	server: serverOptions,
	preview: serverOptions,
});
