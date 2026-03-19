import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		env: {
			NODE_ENV: 'development',
			TESTING: 'true',
		},
		coverage: {
			provider: 'v8',
			reporter: ['text'],
		},
		clearMocks: true,
		projects: [
			{
				extends: './vitest.config.ts',
				test: {
					name: 'unit',
					include: ['src/**/*.spec.ts'],
				},
			},
			{
				extends: './vitest.config.ts',
				test: {
					name: 'e2e',
					include: ['tests/**/*.spec.ts'],
					setupFiles: ['tests/vitest.setup.ts'],
				},
			},
		],
	},
});
