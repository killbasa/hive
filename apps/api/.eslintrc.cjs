// eslint-disable-next-line tsdoc/syntax
/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: ['../../.eslintrc.cjs'],
	parserOptions: {
		project: ['./tsconfig.eslint.json'],
		tsconfigRootDir: __dirname
	}
};
