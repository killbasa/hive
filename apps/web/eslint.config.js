import eslintConfig from '@hive/eslint-config/svelte';

/**
 * @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray}
 */
const config = [
	{
		name: 'hive/base-ignore',
		ignores: ['.svelte-kit/', 'dist/', 'node_modules/', '**/api.d.ts'],
	},
	...eslintConfig,
	{
		files: ['**/*.ts', '**/*.svelte'],
		rules: {
			'import/no-duplicates': 'off',
			'import/no-unresolved': ['error', { ignore: ['^\\$app/'] }],
		},
	},
];

export default config;
