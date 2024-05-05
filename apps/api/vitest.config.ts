import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		include: ['src/**/*.spec.ts'],
		env: {
			TESTING: 'true',
		},
		coverage: {
			provider: 'istanbul',
			reporter: ['text'],
		},
	},
});
