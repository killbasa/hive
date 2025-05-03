import 'SHIMS';

import { env } from 'ENV';
import { base, manifest, prerendered } from 'MANIFEST';
import { Server } from 'SERVER';
import FastifyStaticPlugin from '@fastify/static';
import { getRequest, setResponse } from '@sveltejs/kit/node';
import fp from 'fastify-plugin';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';
import type { IncomingHttpHeaders } from 'node:http';

const origin = env('ORIGIN', undefined);
const protocol_header = env('PROTOCOL_HEADER', '').toLowerCase();
const host_header = env('HOST_HEADER', 'host').toLowerCase();
const port_header = env('PORT_HEADER', '').toLowerCase();

const body_size_limit = Number.parseInt(env('BODY_SIZE_LIMIT', '524288'), 10);
const dir = dirname(fileURLToPath(import.meta.url));

const server = new Server(manifest);
await server.init({
	env: process.env as Record<string, string>,
});

export type FastifyAdapterPluginOptions = {
	prefix?: string;
	csp?: string;
};

export default fp<FastifyAdapterPluginOptions>(async (fastify, options) => {
	await fastify.register(
		async (instance) => {
			// Let the UI handle 404s
			// TODO - Check if this is sane
			instance.setNotFoundHandler(() => {});

			await instance.register(FastifyStaticPlugin, {
				root: join(dir, 'client', base),
				etag: true,
				preCompressed: true,
				wildcard: false,
				setHeaders: (res, pathname) => {
					if (pathname.includes(`/${manifest.appPath}/immutable/`) && res.statusCode === 200) {
						res.setHeader('Cache-Control', 'public,max-age=31536000,immutable');
					}
				},
			});

			// Server routes
			instance.addHook('onRequest', async (req, res) => {
				if (req.routeOptions.url) {
					return;
				}

				let request: Request;

				try {
					request = await getRequest({
						base: origin || get_origin(req.headers),
						request: req.raw,
						bodySizeLimit: body_size_limit,
					});
				} catch (err) {
					instance.log.error(err);

					res.status((err as { status?: number }).status ?? 400);
					return await res.send('Invalid request body');
				}

				const response = await server.respond(request, {
					platform: { req: req.raw },
					getClientAddress: () => req.ip,
				});

				if (options.csp) {
					res.raw.setHeader('Content-Security-Policy', options.csp);
				}

				await setResponse(res.raw, response);
			});

			const prerenderedPath = join(dir, 'prerendered');
			if (existsSync(prerenderedPath)) {
				await fastify.register(FastifyStaticPlugin, {
					root: prerenderedPath,
					etag: true,
					preCompressed: true,
					serve: false,
					extensions: ['html'],
					decorateReply: false,
					wildcard: false,
				});

				// Prerendered routes
				fastify.addHook('onRequest', (req, res, done): void => {
					const { url } = req;

					if (prerendered.has(url)) {
						if (options.csp) {
							res.header('Content-Security-Policy', options.csp);
						}

						if (url.endsWith('/')) {
							res.sendFile(`${url}index.html`, prerenderedPath);
						} else {
							res.sendFile(`${url}.html`, prerenderedPath);
						}

						return;
					}

					const location = url.at(-1) === '/' ? url.slice(0, -1) : `${url}/`;

					if (prerendered.has(location)) {
						res.redirect(location, 308);
						return;
					}

					done();
				});
			}
		},
		{ prefix: options.prefix },
	);
});

function get_origin(headers: IncomingHttpHeaders): string {
	let protocol = 'https';

	if (protocol_header) {
		const protocol_from_header = headers[protocol_header];
		if (typeof protocol_from_header === 'string') {
			protocol = protocol_from_header;
		}
	}

	const host = headers[host_header];
	const port = port_header && headers[port_header];
	if (port) {
		return `${protocol}://${host}:${port}`;
	}

	return `${protocol}://${host}`;
}
