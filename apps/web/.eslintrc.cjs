/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	extends: [
		'plugin:vue/vue3-essential', //
		'eslint:recommended',
		'@vue/eslint-config-typescript',
		'plugin:prettier/recommended'
	],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	rules: {
		'vue/multi-word-component-names': 'off'
	}
};
