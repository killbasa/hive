import type { FastifyPluginCallback } from 'fastify';

export const authRoutes: FastifyPluginCallback = (server, _, done) => {
	server.get(
		'/', //
		{ schema: { tags: ['Auth'] } },
		async (_, reply): Promise<void> => {
			await reply.send({ message: 'OK' });
		}
	);

	done();
};
