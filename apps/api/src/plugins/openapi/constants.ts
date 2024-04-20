export const ScalarCDNUrl = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.22.3/dist/browser/standalone.min.js';

export const ScalarHTML = scalarHTML(ScalarCDNUrl);

export const ScalarContentSecurityPolicies: string = [
	"default-src 'none'", //
	`script-src-elem 'self' ${ScalarCDNUrl}`,
	"style-src 'self' 'unsafe-inline' https:",
	'font-src fonts.gstatic.com',
	"connect-src 'self'",
	"img-src 'self'"
].join('; ');

export function scalarHTML(cdnUrl: string): string {
	return `
	<!DOCTYPE html>
	<html>
	<head>
		<title>API Reference</title>
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
