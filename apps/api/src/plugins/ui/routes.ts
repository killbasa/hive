import { UiContentSecurityPolicies } from './constants.js';
import { handler } from '@hive/web/handler';
import type { FastifyPluginCallback } from 'fastify';

export const uiPlugin: FastifyPluginCallback = (server, _, done) => {
	server.removeAllContentTypeParsers();

	server.all('', (_, res) => {
		return res.redirect('/ui/');
	});

	server.all(
		'/*',
		{
			onRequest: (req, res) => {
				res.hijack();

				res.raw.setHeader('content-security-policy', UiContentSecurityPolicies);

				return handler(req.raw, res.raw, () => {});
			},
		},
		() => {},
	);

	done();
};
