import { db } from '../db/client';
import { doesChannelExist } from '../lib/youtube/channels';
import { indexer } from '../queues/indexer';
import { z } from 'zod';
import type { FastifyPluginCallback } from 'fastify';

export const channelRoutes: FastifyPluginCallback = (server, _, done) => {
	server.get(
		'/', //
		{ schema: { tags: ['Channels'] } },
		async (_, reply): Promise<void> => {
			const result = await db.query.channels.findMany();

			await reply.send({ channels: result });
		}
	);

	const ChannelSchema = z.object({
		id: z.string()
	});

	server.post(
		'/', //
		{ schema: { tags: ['Channels'] } },
		async (request, reply): Promise<void> => {
			const data = ChannelSchema.parse(request.body);

			// TODO: exists utility
			// ref: https://github.com/drizzle-team/drizzle-orm/pull/1405
			const alreadyDownloaded = await db.query.channels.findFirst({
				where: ({ id }, { eq }) => eq(id, data.id),
				columns: { id: true }
			});
			if (alreadyDownloaded) {
				return await reply.status(409).send({ message: 'Channel already downloaded' });
			}

			const exists = await doesChannelExist(data.id);
			if (!exists) {
				return await reply.status(404).send({ message: 'Channel does not exist' });
			}

			await indexer.add(
				`channel/${data.id}`,
				{
					type: 'channel',
					channelId: data.id
				},
				{ removeOnComplete: true }
			);
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
