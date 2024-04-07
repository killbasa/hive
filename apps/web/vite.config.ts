import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		entries: ['pretty-bytes']
	},
	server: {
		port: 3000,
		strictPort: true
	},
	preview: {
		port: 3000,
		strictPort: true
	}
});
