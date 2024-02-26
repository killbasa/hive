import { live } from '#/routes/live';
import { chat } from '#/routes/chat';
import { videos } from '#/routes/videos';
import { channels } from '#/routes/channels';
import { root } from '#/routes/root';
import { reference } from '#/routes/reference';
import type { FastifyPluginCallback } from 'fastify';

export const routes: FastifyPluginCallback = async (server) => {
	await server.register(root);
	await server.register(reference);

	await server.register(channels, { prefix: 'channels' });
	await server.register(videos, { prefix: 'videos' });
	await server.register(live, { prefix: 'live' });
	await server.register(chat, { prefix: 'chat' });
};
