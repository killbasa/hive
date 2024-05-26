/** @type {import('prettier').Config} */
module.exports = {
	...require('@killbasa/prettier-config'),
	trailingComma: 'all',
	overrides: [
		{
			files: '*.{yml,yaml}',
			options: {
				singleQuote: false,
				useTabs: false,
			},
		},
		{
			files: 'tsconfig.{*.json,.json}',
			options: {
				printWidth: 80,
			},
		},
	],
};
