import { and, count, eq, gt, inArray, like } from 'drizzle-orm';
import type { SQLWrapper } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { videos } from '../../db/schema.js';
import { EmptyResponse } from '../../lib/responses.js';
import type { HiveRoutes } from '../../lib/types/hive.js';
import { VideoIgnoreBody, VideoPatchBody } from './body.js';
import { VideoGetQuery, VideoListGetQuery, VideoPatchQuery } from './query.js';
import { VideoListSchema, VideoSchema, VideoWithCommentsSchema } from './schema.js';

export const videoRoutes: HiveRoutes = {
	authenticated: (server, _, done) => {
		server.get(
			'', //
			{
				schema: {
					description: 'Get a list of videos',
					tags: ['Videos'],
					querystring: VideoListGetQuery,
					response: {
						200: VideoListSchema,
					},
				},
			},
			async (request, reply): Promise<void> => {
				const { query } = request;
				const whereArgs: (SQLWrapper | undefined)[] = [];

				if (query.type) {
					whereArgs.push(inArray(videos.type, query.type));
				}

				if (query.status) {
					whereArgs.push(inArray(videos.status, query.status));
				}

				if (query.downloadStatus) {
					whereArgs.push(inArray(videos.downloadStatus, query.downloadStatus));
				}

				if (query.channelId) {
					whereArgs.push(eq(videos.channelId, query.channelId));
				}

				if (query.search) {
					whereArgs.push(like(videos.title, `%${query.search}%`));
				}

				if (query.inProgress) {
					whereArgs.push(gt(videos.watchProgress, 0));
				}

				const where = and(...whereArgs);

				const [result, countRes] = await Promise.all([
					db.query.videos.findMany({
						where,
						orderBy: (video, { desc }) => desc(video.updatedAt),
						limit: query.inProgress ? 4 : 24,
						offset: (query.page - 1) * 24,
					}),
					db //
						.select({ total: count() })
						.from(videos)
						.where(where),
				]);

				return await reply.status(200).send({
					videos: result,
					total: countRes[0].total,
				});
			},
		);

		server.post(
			'/ignore',
			{
				schema: {
					description: 'Ignore videos',
					tags: ['Videos'],
					body: VideoIgnoreBody,
					response: {
						204: EmptyResponse('Videos IDs ignored'),
					},
				},
			},
			async (request, reply): Promise<void> => {
				await db
					.update(videos)
					.set({
						downloadStatus: 'ignored',
					})
					.where(inArray(videos.id, request.body.videoIds))
					.returning();

				await reply.status(204).send();
			},
		);

		server.get(
			'/:videoId',
			{
				schema: {
					description: 'Get a video',
					tags: ['Videos'],
					params: VideoGetQuery,
					response: {
						200: VideoWithCommentsSchema,
						404: EmptyResponse('Video not found'),
					},
				},
			},
			async (request, reply): Promise<void> => {
				const { videoId } = request.params;

				const result = await db.query.videos.findFirst({
					where: ({ id }, { eq }) => eq(id, videoId),
					with: { comments: true },
					columns: { updatedAt: false },
				});
				if (result === undefined) {
					return await reply.status(404).send();
				}

				await reply.status(200).send(result);
			},
		);

		server.patch(
			'/:videoId',
			{
				schema: {
					description: 'Update a video',
					tags: ['Videos'],
					params: VideoPatchQuery,
					body: VideoPatchBody,
					response: {
						200: VideoSchema,
					},
				},
			},
			async (request, reply): Promise<void> => {
				const { videoId } = request.params;

				const result = await db
					.update(videos)
					.set({
						watchProgress: request.body.watchProgress,
						downloadStatus: request.body.downloadStatus,
					})
					.where(eq(videos.id, videoId))
					.returning();

				await reply.status(200).send(result.at(0));
			},
		);

		done();
	},
};
