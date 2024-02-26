// eslint-disable-next-line tsdoc/syntax
/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	extends: ['@kbotdev/eslint-config'],
	parserOptions: {
		project: './tsconfig.eslint.json',
		tsconfigRootDir: __dirname
	}
};
