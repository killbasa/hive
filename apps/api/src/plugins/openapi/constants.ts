import { isDev } from '../../lib/constants.js';
import { resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

export const ScalarHTML = getScalarHTML();
export const ScalarJS = getScalarJS();
export const ScalarFonts = {
	Inter: readFileSync(resolve('static/inter-latin.woff2')),
	Mono: readFileSync(resolve('static/mono-latin.woff2')),
};

export const ScalarContentSecurityPolicies: string = [
	"default-src 'none'", //
	"script-src-elem 'self' 'unsafe-inline'",
	"script-src 'self'",
	"style-src 'self' 'unsafe-inline'",
	"font-src 'self'",
	"connect-src 'self'",
	"img-src 'self'",
	...(isDev ? ['report-uri http://localhost:3001/csp'] : []),
].join('; ');

function getScalarHTML(): string {
	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<title>Hive API Reference</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon">
		<style>
			body { margin: 0; }
		</style>
	</head>
		<body>
			<script id="api-reference" data-url="/spec.json"></script>
			<script src="/scalar.js"></script>
		</body>
	</html>
  `;
}

function getScalarJS(): string {
	const filePaths = [
		resolve('node_modules/@scalar/api-reference/dist/browser/standalone.js'), //
	];

	const filePath = filePaths.find((file) => existsSync(file));

	if (filePath === undefined) {
		throw new Error('JavaScript file not found');
	}

	const file = readFileSync(filePath, 'utf8');
	return file.replaceAll('https://fonts.scalar.com', '');
}
