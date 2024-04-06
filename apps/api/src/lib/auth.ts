import type { onRequestAsyncHookHandler } from 'fastify';

export const checkToken: onRequestAsyncHookHandler = async (request, reply) => {
	try {
		await request.jwtVerify();
	} catch (err) {
		await reply.send(err);
	}
};
