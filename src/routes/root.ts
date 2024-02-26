import type { FastifyPluginCallback } from 'fastify';

export const root: FastifyPluginCallback = (server, _, done) => {
	server.get('/heartbeat', async (_, reply): Promise<void> => {
		await reply.send({ message: 'OK' });
	});

	done();
};
