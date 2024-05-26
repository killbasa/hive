import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
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
]);
