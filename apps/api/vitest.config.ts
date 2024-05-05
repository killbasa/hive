import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		env: {
			TESTING: 'true',
		},
		coverage: {
			provider: 'istanbul',
			reporter: ['text'],
		},
		include: ['src/**/*.spec.ts'],
	},
});
