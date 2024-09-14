import { isDev } from '../../lib/constants.js';

const ScalarVersion = '1.25.11';
export const ScalarCDNUrl = `https://cdn.jsdelivr.net/npm/@scalar/api-reference@${ScalarVersion}/dist/browser/standalone.min.js`;

export const ScalarHTML = scalarHTML(ScalarCDNUrl);

export const ScalarContentSecurityPolicies: string = [
	"default-src 'none'", //
	`script-src-elem 'self' 'unsafe-inline' ${ScalarCDNUrl}`,
	"script-src 'self' 'unsafe-eval'",
	"style-src 'self' 'unsafe-inline' https:",
	'font-src fonts.gstatic.com',
	"connect-src 'self'",
	"img-src 'self'",
	...(isDev ? ['report-uri http://localhost:3001/csp'] : []),
].join('; ');

export function scalarHTML(cdnUrl: string): string {
	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<title>Hive API Reference</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<style>
			body { margin: 0; }
		</style>
	</head>
		<body>
			<script id="api-reference" data-url="/spec.json"></script>
			<script src="${cdnUrl}"></script>
		</body>
	</html>
  `;
}
