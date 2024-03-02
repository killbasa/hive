import { db } from '../db/pool';
import { channels } from '../db/schema';
import { channelExists } from '../lib/youtube';
import { z } from 'zod';
import type { FastifyPluginCallback } from 'fastify';

const channelSchema = z.object({
	id: z.string(),
	name: z.string()
});

export const channelRoutes: FastifyPluginCallback = (server, _, done) => {
	server.post(
		'/', //
		{ schema: { tags: ['Channels'] } },
		async (request, reply): Promise<void> => {
			const data = channelSchema.parse(request.body);

			const exists = await channelExists(data.id);
			if (!exists) {
				return await reply.status(400).send({ message: 'Channel does not exist' });
			}

			await db
				.insert(channels)
				.values({
					id: data.id,
					name: data.name
				})
				.execute();

			await reply.status(201).send({
				id: data.id,
				name: data.name
			});
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
