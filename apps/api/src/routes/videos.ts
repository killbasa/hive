import { db } from '../db/pool';
import type { FastifyPluginCallback } from 'fastify';

export const videoRoutes: FastifyPluginCallback = (server, _, done) => {
	server.get<{ Querystring: { videoIds: string } }>(
		'/', //
		{ schema: { tags: ['Videos'] } },
		async (request, reply): Promise<void> => {
			const { videoIds } = request.query;
			const ids = videoIds.split(',');
			if (ids.length === 0) {
				return await reply.send([]);
			}

			const result = await db.query.videos.findMany({
				where: ({ id }, { inArray }) => inArray(id, ids)
			});

			await reply.send(result);
		}
	);

	server.get<{ Params: { videoId: string } }>(
		'/:videoId', //
		{ schema: { tags: ['Videos'] } },
		async (request, reply): Promise<void> => {
			const { videoId } = request.params;

			const result = await db.query.videos.findFirst({
				where: ({ id }, { eq }) => eq(id, videoId)
			});
			if (result === undefined) {
				return await reply.status(404).send();
			}

			await reply.send(result);
		}
	);

	done();
};
