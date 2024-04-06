import { db } from '../db/client';
import { videos } from '../db/schema';
import { checkToken } from '../lib/auth';
import { z } from 'zod';
import { and, count, eq, gt, inArray, like } from 'drizzle-orm';
import type { SQLWrapper } from 'drizzle-orm';
import type { FastifyPluginCallback } from 'fastify';

export const videoRoutes: FastifyPluginCallback = (server, _, done) => {
	server.addHook('onRequest', checkToken);

	const QuerySchema = z.object({
		page: z.coerce.number().default(1),
		status: z.enum(['done', 'pending']).optional(),
		channelId: z.string().optional(),
		search: z.string().optional(),
		inProgress: z.coerce.boolean().default(false)
	});

	server.get<{ Querystring: { page?: string; status?: string; channelId: string } }>(
		'/', //
		{ schema: { tags: ['Videos'] } },
		async (request, reply): Promise<void> => {
			const query = QuerySchema.parse(request.query);
			const whereArgs: (SQLWrapper | undefined)[] = [];

			if (query.status) whereArgs.push(eq(videos.downloadStatus, query.status));
			if (query.channelId) whereArgs.push(eq(videos.channelId, query.channelId));
			if (query.search) whereArgs.push(like(videos.title, `%${query.search}%`));
			if (query.inProgress) whereArgs.push(gt(videos.watchProgress, 0));

			const [result, countRes] = await Promise.all([
				db.query.videos.findMany({
					where: and(...whereArgs),
					orderBy: (video, { desc }) => desc(video.updatedAt),
					limit: query.inProgress ? 4 : 25,
					offset: (query.page - 1) * 24
				}),
				db //
					.select({ total: count() })
					.from(videos)
					.where(and(...whereArgs))
			]);

			return await reply.send({ videos: result, total: countRes[0].total });
		}
	);

	const VideoIgnoreSchema = z.object({
		videoIds: z.array(z.string())
	});

	server.post(
		'/ignore', //
		{ schema: { tags: ['Videos'] } },
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

	const VideoProgressSchema = z.object({
		progress: z.number()
	});

	server.post<{ Params: { videoId: string } }>(
		'/:videoId/progress', //
		{ schema: { tags: ['Videos'] } },
		async (request, reply): Promise<void> => {
			const data = VideoProgressSchema.parse(request.body);

			await db //
				.update(videos)
				.set({
					watchProgress: data.progress
				})
				.where(eq(videos.id, request.params.videoId))
				.execute();

			await reply.status(204).send();
		}
	);

	done();
};
