import { db } from '../db/pool';
import { checkVideos, syncVideos } from '../jobs/workers';
import { videos } from '../db/schema';
import { sql } from 'drizzle-orm';
import type { FastifyPluginCallback } from 'fastify';

export const videoRoutes: FastifyPluginCallback = (server, _, done) => {
	server.get<{ Querystring: { videoIds?: string } }>(
		'/', //
		{ schema: { tags: ['Videos'] } },
		async (request, reply): Promise<void> => {
			const { videoIds } = request.query;

			if (!videoIds) {
				const result = await db.query.videos.findMany({
					limit: 50
				});

				return await reply.send({ videos: result });
			}

			const ids = videoIds.split(',');
			if (ids.length === 0) {
				return await reply.send([]);
			}

			const result = await db.query.videos.findMany({
				where: ({ id }, { inArray }) => inArray(id, ids),
				limit: 50
			});

			await reply.send({ videos: result });
		}
	);

	server.get<{ Params: { videoId: string } }>(
		'/stats', //
		{ schema: { tags: ['Videos'] } },
		async (_, reply): Promise<void> => {
			const result = await db.select({ total: sql`COUNT(*)` }).from(videos);

			await reply.send({
				count: result[0].total
			});
		}
	);

	server.post<{ Params: { videoId: string } }>(
		'/sync', //
		{ schema: { tags: ['Videos'] } },
		async (_, reply): Promise<void> => {
			await syncVideos();
			await checkVideos();

			await reply.status(200).send();
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
