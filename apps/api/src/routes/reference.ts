import type { FastifyPluginCallback } from 'fastify';

export const referenceRoutes: FastifyPluginCallback = (server, _, done) => {
	server.get(
		'/spec.json', //
		{ schema: { hide: true } },
		async (_, reply): Promise<void> => {
			await reply
				.headers({
					'Content-Type': 'application/json; charset=utf-8'
				})
				.send(server.swagger());
		}
	);

	const cdnUrl = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.18.1/dist/browser/standalone.min.js';
	const html = scalarHTML(cdnUrl);

	const csp: string[] = [
		"default-src 'none'", //
		`script-src-elem 'self' ${cdnUrl}`,
		"style-src 'self' 'unsafe-inline' https:",
		'font-src fonts.gstatic.com',
		"connect-src 'self'",
		"img-src 'self'"
	];
	server.get(
		'/reference', //
		{ schema: { hide: true } },
		async (_, reply): Promise<void> => {
			await reply
				.headers({
					'Content-Type': 'text/html; charset=utf-8',
					'Content-Security-Policy': csp.join('; ')
				})
				.send(html);
		}
	);

	done();
};

export function scalarHTML(cdnUrl: string): string {
	return `
	<!DOCTYPE html>
	<html>
	<head>
		<title>API Reference</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<style>
			body {
				margin: 0;
			}
		</style>
	</head>
		<body>
			<script id="api-reference" data-url="/spec.json"></script>
			<script src="${cdnUrl}"></script>
		</body>
	</html>
  `;
}
