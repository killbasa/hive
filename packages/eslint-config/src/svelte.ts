import svelteParser from 'svelte-eslint-parser';
import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import eslintPrettier from 'eslint-plugin-prettier/recommended';
// @ts-expect-error - No types
import importPlugin from 'eslint-plugin-import';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import type { TSESLint } from '@typescript-eslint/utils';

/**
 * @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray}
 */
const baseConfig: TSESLint.FlatConfig.ConfigArray = tsEslint.config({
	name: 'hive/eslint-config',
	extends: [importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
	languageOptions: {
		globals: {
			...globals.node,
			...globals.es2017,
			...globals.es2020,
			...globals.browser,
			...globals.commonjs,
		},
		parser: tsParser,
		parserOptions: {
			project: ['./tsconfig.json', './tsconfig.eslint.json'],
			sourceType: 'module',
			ecmaVersion: 2022,
			warnOnUnsupportedTypeScriptVersion: false,
			extraFileExtensions: ['.svelte'],
		},
	},
	settings: {
		'import/resolver': {
			typescript: true,
			node: true,
		},
	},
	rules: {
		'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
		'import/no-duplicates': 'error',
		'import/no-unresolved': 'off',
		'import/no-named-as-default': 'off',
		'import/order': [
			'error',
			{
				groups: [
					'index', //
					'sibling',
					'parent',
					'internal',
					'external',
					'builtin',
					'object',
					'type',
				],
			},
		],
	},
});

const config = (cfg: unknown): TSESLint.FlatConfig.ConfigArray => {
	return tsEslint.config(
		eslint.configs.recommended,
		...tsEslint.configs.recommended,
		eslintPrettier,
		...baseConfig,
		...svelte.configs['flat/prettier'],
		{
			name: 'hive/svelte',
			files: [
				'**/*.svelte', //
				'*.svelte',
				'**/*.svelte.js',
				'*.svelte.js',
				'**/*.svelte.ts',
				'*.svelte.ts',
			],
			languageOptions: {
				parser: svelteParser,
				parserOptions: {
					parser: tsParser,
					svelteConfig: cfg,
				},
			},
		},
	);
};

export default config;
