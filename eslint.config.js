import eslintConfig from '@hive/eslint-config';

/**
 * @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray}
 */
const config = [
	{
		name: 'hive/base-ignore',
		ignores: ['.husky/', 'node_modules/', '**/dist/', '**/*.d.ts', '**/coverage/', '**/data/'],
	},
	...eslintConfig,
];

export default config;
