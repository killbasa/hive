import { db } from '../db/pool';
import { channels } from '../db/schema';
import { syncChannelMetadata } from '../jobs/workers';
import { doesChannelExist, fetchChannels } from '../lib/youtube/channels';
import { z } from 'zod';
import { sql } from 'drizzle-orm';
import type { FastifyPluginCallback } from 'fastify';

const channelSchema = z.object({
	id: z.string()
});

export const channelRoutes: FastifyPluginCallback = (server, _, done) => {
	server.get(
		'/', //
		{ schema: { tags: ['Channels'] } },
		async (_, reply): Promise<void> => {
			const result = await db.query.channels.findMany();

			await reply.send({ channels: result });
		}
	);

	server.post(
		'/', //
		{ schema: { tags: ['Channels'] } },
		async (request, reply): Promise<void> => {
			const data = channelSchema.parse(request.body);

			const exists = await doesChannelExist(data.id);
			if (!exists) {
				return await reply.status(400).send({ message: 'Channel does not exist' });
			}

			const channel = await fetchChannels([data.id]);
			const { customUrl, title, thumbnails } = channel[0].snippet;

			const result = await db
				.insert(channels)
				.values({
					id: data.id,
					customUrl,
					name: title,
					photo: thumbnails.high.url
				})
				.returning();

			await reply.status(201).send(result[0]);
		}
	);

	server.get<{ Params: { videoId: string } }>(
		'/stats', //
		{ schema: { tags: ['Channels'] } },
		async (_, reply): Promise<void> => {
			const result = await db.select({ total: sql`COUNT(*)` }).from(channels);

			await reply.send({
				count: result[0].total
			});
		}
	);

	server.post<{ Params: { videoId: string } }>(
		'/sync', //
		{ schema: { tags: ['Channels'] } },
		async (_, reply): Promise<void> => {
			await syncChannelMetadata();

			await reply.status(200).send();
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
