import { db } from '../db/client';
import { videos } from '../db/schema';
import { z } from 'zod';
import { eq, inArray } from 'drizzle-orm';
import type { FastifyPluginCallback } from 'fastify';

export const videoRoutes: FastifyPluginCallback = (server, _, done) => {
	const QuerySchema = z.object({
		page: z.coerce.number().optional().default(1),
		status: z.enum(['done', 'pending']).optional()
	});

	server.get<{ Querystring: { page?: string; status?: string } }>(
		'/', //
		{ schema: { tags: ['Videos'] } },
		async (request, reply): Promise<void> => {
			const query = QuerySchema.parse(request.query);

			const result = await db.query.videos.findMany({
				where: (video, { eq }) => {
					if (query.status) {
						return eq(video.downloadStatus, query.status);
					}

					return undefined;
				},
				orderBy: (video, { desc }) => desc(video.updatedAt),
				limit: 100,
				offset: (query.page - 1) * 24
			});

			return await reply.send({ videos: result });
		}
	);

	const VideoIgnoreSchema = z.object({
		videoIds: z.array(z.string())
	});

	server.post(
		'/ignore', //
		async (request, reply): Promise<void> => {
			const data = VideoIgnoreSchema.parse(request.body);

			await db //
				.update(videos)
				.set({
					downloadStatus: 'ignored'
				})
				.where(inArray(videos.id, data.videoIds))
				.returning();

			await reply.status(204).send();
		}
	);

	server.get<{ Params: { videoId: string } }>(
		'/:videoId', //
		{ schema: { tags: ['Videos'] } },
		async (request, reply): Promise<void> => {
			const { videoId } = request.params;

			const result = await db.query.videos.findFirst({
				where: ({ id }, { eq }) => eq(id, videoId),
				with: { comments: true }
			});
			if (result === undefined) {
				return await reply.status(404).send();
			}

			await reply.send(result);
		}
	);

	const UpdateVideoSchema = z.object({
		downloadStatus: z.enum(['ignored', 'pending'])
	});

	server.patch<{ Params: { videoId: string } }>(
		'/:videoId', //
		{ schema: { tags: ['Videos'] } },
		async (request, reply): Promise<void> => {
			const { videoId } = request.params;
			const data = UpdateVideoSchema.parse(request.body);

			const result = await db //
				.update(videos)
				.set({
					downloadStatus: data.downloadStatus
				})
				.where(eq(videos.id, videoId))
				.returning();

			await reply.send(result.at(0));
		}
	);

	done();
};