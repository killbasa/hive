import { db } from '../../db/client.js';
import { videos } from '../../db/schema.js';
import { tokenHandler } from '../auth/tokens.js';
import { and, count, eq, gt, inArray, like } from 'drizzle-orm';
import { Type } from '@fastify/type-provider-typebox';
import { VideoIgnoreSchema, VideoPatchSchema, VideoProgressSchema, VideoQuerySchema } from '@hive/common';
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import type { SQLWrapper } from 'drizzle-orm';

export const videoRoutes: FastifyPluginAsyncTypebox = async (server): Promise<void> => {
	server.addHook('onRequest', tokenHandler);

	server.get(
		'/', //
		{
			schema: {
				tags: ['Videos'],
				querystring: VideoQuerySchema
			}
		},
		async (request, reply): Promise<void> => {
			const { query } = request;
			const whereArgs: (SQLWrapper | undefined)[] = [];

			if (query.type) whereArgs.push(inArray(videos.type, query.type));
			if (query.status) whereArgs.push(inArray(videos.status, query.status));
			if (query.downloadStatus) whereArgs.push(inArray(videos.downloadStatus, query.downloadStatus));
			if (query.channelId) whereArgs.push(eq(videos.channelId, query.channelId));
			if (query.search) whereArgs.push(like(videos.title, `%${query.search}%`));
			if (query.inProgress) whereArgs.push(gt(videos.watchProgress, 0));

			const where = and(...whereArgs);

			const [result, countRes] = await Promise.all([
				db.query.videos.findMany({
					where,
					orderBy: (video, { desc }) => desc(video.updatedAt),
					limit: query.inProgress ? 4 : 24,
					offset: (query.page - 1) * 24
				}),
				db //
					.select({ total: count() })
					.from(videos)
					.where(where)
			]);

			return await reply.status(200).send({ videos: result, total: countRes[0].total });
		}
	);

	server.post(
		'/ignore',
		{
			schema: {
				tags: ['Videos'],
				body: VideoIgnoreSchema,
				response: { 204: { type: 'null' } }
			}
		},
		async (request, reply): Promise<void> => {
			await db
				.update(videos)
				.set({
					downloadStatus: 'ignored'
				})
				.where(inArray(videos.id, request.body.videoIds))
				.returning();

			await reply.status(204).send();
		}
	);

	server.get(
		'/:videoId',
		{
			schema: {
				tags: ['Videos'],
				params: Type.Object({
					videoId: Type.String()
				})
			}
		},
		async (request, reply): Promise<void> => {
			const { videoId } = request.params;

			const result = await db.query.videos.findFirst({
				where: ({ id }, { eq }) => eq(id, videoId),
				with: { comments: true }
			});
			if (result === undefined) {
				return await reply.status(404).send();
			}

			await reply.status(200).send(result);
		}
	);

	server.patch(
		'/:videoId',
		{
			schema: {
				tags: ['Videos'],
				params: Type.Object({
					videoId: Type.String()
				}),
				body: VideoPatchSchema,
				response: {
					200: { type: 'null' }
				}
			}
		},
		async (request, reply): Promise<void> => {
			const { videoId } = request.params;

			const result = await db
				.update(videos)
				.set({
					downloadStatus: request.body.downloadStatus
				})
				.where(eq(videos.id, videoId))
				.returning();

			await reply.status(200).send(result.at(0));
		}
	);

	server.addSchema({
		$id: 'videoProgressSchema',
		type: 'object',
		properties: {
			progress: { type: 'number' }
		}
	});

	server.post(
		'/:videoId/progress',
		{
			schema: {
				tags: ['Videos'],
				params: Type.Object({
					videoId: Type.String()
				}),
				body: VideoProgressSchema
			}
		},
		async (request, reply): Promise<void> => {
			await db
				.update(videos)
				.set({
					watchProgress: request.body.progress
				})
				.where(eq(videos.id, request.params.videoId))
				.execute();

			await reply.status(204).send();
		}
	);
};
