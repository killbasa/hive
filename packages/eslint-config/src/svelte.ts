import svelteParser from 'svelte-eslint-parser';
// @ts-expect-error - No types
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPrettier from 'eslint-plugin-prettier/recommended';
// @ts-expect-error - No types
import eslintImport from 'eslint-plugin-import';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import type { TSESLint } from '@typescript-eslint/utils';

/**
 * @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray}
 */
const config: TSESLint.FlatConfig.ConfigArray = tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	eslintPrettier,
	{
		name: 'hive/web',
		plugins: {
			import: eslintImport,
		},
		languageOptions: {
			globals: {
				...globals.node,
				...globals.es2017,
				...globals.es2020,
				...globals.browser,
				...globals.jest,
				...globals.commonjs,
			},
			parser: tseslint.parser,
			parserOptions: {
				project: ['./tsconfig.json', './tsconfig.eslint.json'],
				sourceType: 'module',
				ecmaVersion: 2022,
				warnOnUnsupportedTypeScriptVersion: false,
				extraFileExtensions: ['.svelte'],
			},
		},
		settings: {
			'import/parsers': {
				'@typescript-eslint/parser': ['.ts'],
			},
			'import/resolver': {
				typescript: true,
				node: true,
			},
		},
		rules: {
			'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
			'import/no-duplicates': 'error',
			'import/no-unresolved': 'error',
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
	},
	...svelte.configs['flat/prettier'],
	{
		name: 'hive/svelte',
		files: ['*.svelte', '**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tseslint.parser,
			},
		},
	},
);

export default config;
