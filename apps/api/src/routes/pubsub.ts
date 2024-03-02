import type { FastifyPluginCallback } from 'fastify';

// https://developers.google.com/youtube/v3/guides/push_notifications
export const pubsubRoutes: FastifyPluginCallback = (server, _, done) => {
	server.post(
		'/', //
		{ schema: { hide: true } },
		async (request, reply): Promise<void> => {
			server.log.info(request.body);

			await reply.send({ hello: 'world' });
		}
	);

	done();
};
