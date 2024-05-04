import { ChannelPostSchema, ChannelQuerySchema } from './schemas.js';
import { tokenHandler } from '../auth/tokens.js';
import { db } from '../../db/client.js';
import { channels } from '../../db/schema.js';
import { doesChannelExist, parseTags } from '../../lib/youtube/channels.js';
import { count } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';

export const channelRoutes: FastifyPluginAsync = async (server) => {
	server.addHook('onRequest', tokenHandler);

	server.get<{ Querystring: { page?: string } }>(
		'', //
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

			await reply.send({
				channels: result.map((channel) => {
					return {
						...channel,
						tags: parseTags(channel.tags)
					};
				}),
				total: countRes[0].total
			});
		}
	);

	server.post(
		'', //
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

			await reply.send({
				...result,
				tags: parseTags(result.tags)
			});
		}
	);
};
