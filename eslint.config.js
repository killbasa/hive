import eslintConfig from '@hive/eslint-config';

/**
 * @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray}
 */
const config = [
	...eslintConfig,
	{
		name: 'hive/base-ignore',
		ignores: ['.husky/', 'node_modules/', '**/dist/', '**/*.d.ts', '**/coverage/', '**/data/'],
	},
	{
		rules: {
			'import/no-unresolved': 'off',
		},
	},
];

export default config;
