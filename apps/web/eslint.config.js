import cfg from './svelte.config.js';
import eslintConfig from '@hive/eslint-config/svelte';

/**
 * @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray}
 */
const config = [
	...eslintConfig(cfg),
	{
		name: 'hive/base-ignore',
		ignores: ['.svelte-kit/', 'dist/', 'node_modules/', '**/api.d.ts'],
	},
	{
		files: ['**/*.ts', '**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		rules: {
			'import/no-duplicates': 'off',
			'import/namespace': 'off',
			'import/no-unresolved': 'off',
			'import/order': 'off',
		},
	},
];

export default config;
