import type { FastifyPluginCallback } from 'fastify';

export const channels: FastifyPluginCallback = (server, _, done) => {
	server.get('/', async (_, reply): Promise<void> => {
		await reply.send({ hello: 'world' });
	});

	done();
};
