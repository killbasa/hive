import { ChannelPostSchema, ChannelQuerySchema } from './schemas';
import { checkToken } from '../auth/tokens';
import { db } from '../../db/client';
import { channels } from '../../db/schema';
import { doesChannelExist } from '../../lib/youtube/channels';
import { count } from 'drizzle-orm';
import type { FastifyPluginCallback } from 'fastify';

export const channelRoutes: FastifyPluginCallback = (server, _, done) => {
	server.addHook('onRequest', checkToken);

	server.get<{ Querystring: { page?: string } }>(
		'/', //
		{ schema: { tags: ['Channels'] } },
		async (request, reply): Promise<void> => {
			const query = ChannelQuerySchema.parse(request.query);

			const [result, countRes] = await Promise.all([
				db.query.channels.findMany({
					limit: 25,
					offset: (query.page - 1) * 24
				}),
				db.select({ total: count() }).from(channels)
			]);

			await reply.send({ channels: result, total: countRes[0].total });
		}
	);

	server.post(
		'/', //
		{ schema: { tags: ['Channels'] } },
		async (request, reply): Promise<void> => {
			const data = ChannelPostSchema.parse(request.body);

			const alreadyDownloaded = await db.query.channels.findFirst({
				where: ({ id }, { eq }) => eq(id, data.id),
				columns: { id: true }
			});
			if (alreadyDownloaded) {
				return await reply.status(409).send({ message: 'Channel already downloaded' });
			}

			const exists = await doesChannelExist(data.id, 'youtube');
			if (!exists) {
				return await reply.status(404).send({ message: 'Channel does not exist' });
			}

			const existingJob = await server.tasks.scanner.getJob(`channel/${data.id}/download`);
			if (existingJob !== undefined) {
				return await reply.status(409).send({ message: 'Channel already queued for download' });
			}

			await server.tasks.scanner.add(`channel/${data.id}/download`, {
				type: 'channel',
				channelId: data.id
			});

			await reply.status(201).send();
		}
	);

	server.get<{ Params: { channelId: string } }>(
		'/:channelId', //
		{ schema: { tags: ['Channels'] } },
		async (request, reply): Promise<void> => {
			const { channelId } = request.params;

			const result = await db.query.channels.findFirst({
				where: ({ id }, { eq }) => eq(id, channelId)
			});
			if (result === undefined) {
				return await reply.status(404).send();
			}

			await reply.send(result);
		}
	);

	done();
};