import { ChannelPostBody } from './body.js';
import { ChannelQuerySchema } from './query.js';
import { ChanneListSchema, ChannelSchema, ChannelStatsSchema } from './schema.js';
import { db } from '../../db/client.js';
import { channels, videos } from '../../db/schema.js';
import { CHANNEL_PATH, isChannelDownloaded } from '../../lib/fs/channels.js';
import { du } from '../../lib/fs/utils.js';
import { EmptyResponse, MessageResponse } from '../../lib/responses.js';
import { doesChannelExist, parseTags } from '../../lib/youtube/channels.js';
import { and, count, eq } from 'drizzle-orm';
import { Type } from '@fastify/type-provider-typebox';
import type { SQLWrapper } from 'drizzle-orm';
import type { HiveRoutes } from '../../lib/types/hive.js';

export const channelRoutes: HiveRoutes = {
	authenticated: (server, _, done) => {
		server.get(
			'/', //
			{
				schema: {
					description: 'Get a list of channels',
					tags: ['Channels'],
					security: [{ apikey: ['x-api-key'] }],
					querystring: ChannelQuerySchema,
					response: {
						200: ChanneListSchema,
					},
				},
			},
			async (request, reply): Promise<void> => {
				const [result, countRes] = await Promise.all([
					db.query.channels.findMany({
						limit: 24,
						offset: (request.query.page - 1) * 24,
					}),
					db.select({ total: count() }).from(channels),
				]);

				await reply.status(200).send({
					channels: result.map((channel) => {
						return {
							...channel,
							tags: parseTags(channel.tags),
						};
					}),
					total: countRes[0].total,
				});
			},
		);

		server.put(
			'/', //
			{
				schema: {
					description: 'Add a channel',
					tags: ['Channels'],
					security: [{ apikey: ['x-api-key'] }],
					body: ChannelPostBody,
					response: {
						201: EmptyResponse('Channel added successfully'),
						404: MessageResponse('Channel does not exist'),
						409: MessageResponse('Channel already downloaded'),
					},
				},
			},
			async (request, reply): Promise<void> => {
				const { body } = request;

				const alreadyDownloaded = await db.query.channels.findFirst({
					where: ({ id }, { eq }) => eq(id, body.id),
					columns: { id: true },
				});
				if (alreadyDownloaded) {
					return await reply.status(409).send({
						message: 'Channel already downloaded',
					});
				}

				const exists = await doesChannelExist(body.id, 'youtube');
				if (!exists) {
					return await reply.status(404).send({
						message: 'Channel does not exist',
					});
				}

				const existingJob = await server.tasks.scanner.getJob(`channel/${body.id}/download`);
				if (existingJob !== undefined) {
					return await reply.status(409).send({
						message: 'Channel already queued for download',
					});
				}

				await server.tasks.scanner.add(
					`channel/${body.id}/download`,
					{
						type: 'channel',
						channelId: body.id,
					},
					{ jobId: `channel/${body.id}/download` },
				);

				await reply.status(201).send();
			},
		);

		server.get<{ Params: { channelId: string } }>(
			'/:channelId', //
			{
				schema: {
					description: 'Get a channel',
					tags: ['Channels'],
					security: [{ apikey: ['x-api-key'] }],
					params: Type.Object({
						channelId: Type.String(),
					}),
					response: {
						200: ChannelSchema,
						404: EmptyResponse('Channel not found'),
					},
				},
			},
			async (request, reply): Promise<void> => {
				const { channelId } = request.params;

				const result = await db.query.channels.findFirst({
					where: ({ id }, { eq }) => eq(id, channelId),
				});
				if (result === undefined) {
					return await reply.status(404).send();
				}

				await reply.status(200).send({
					...result,
					tags: parseTags(result.tags),
				});
			},
		);

		server.post(
			'/:channelId/scan', //
			{
				schema: {
					description: 'Scan a channel for new metadata and assets',
					tags: ['Channels'],
					security: [{ apikey: ['x-api-key'] }],
					params: Type.Object({
						channelId: Type.String(),
					}),
					response: {
						201: EmptyResponse('Scan started successfully'),
					},
				},
			},
			async (request, reply): Promise<void> => {
				const { channelId } = request.params;

				await server.tasks.scanner.add(
					`channel/${channelId}/scan`,
					{
						type: 'channel',
						channelId,
					},
					{ jobId: `channel/${channelId}/scan` },
				);

				await reply.status(201).send();
			},
		);

		server.get<{ Params: { channelId: string } }>(
			'/:channelId/stats', //
			{
				schema: {
					description: 'Get stats about a channel',
					tags: ['Channels'],
					security: [{ apikey: ['x-api-key'] }],
					params: Type.Object({
						channelId: Type.String(),
					}),
					response: {
						200: ChannelStatsSchema,
						404: EmptyResponse('Channel not found'),
					},
				},
			},
			async (request, reply): Promise<void> => {
				const { channelId } = request.params;

				const result = isChannelDownloaded(channelId);
				if (!result) {
					return await reply.status(404).send();
				}

				const where: (SQLWrapper | undefined)[] = [
					eq(videos.channelId, channelId), //
					eq(videos.downloadStatus, 'done'),
				];

				const [videoCount, streamCount, shortCount, dirSize] = await Promise.all([
					db
						.select({ total: count() })
						.from(videos)
						.where(and(...where, eq(videos.type, 'video'))),
					db
						.select({ total: count() })
						.from(videos)
						.where(and(...where, eq(videos.type, 'stream'))),
					db
						.select({ total: count() })
						.from(videos)
						.where(and(...where, eq(videos.type, 'short'))),
					du(CHANNEL_PATH(channelId)),
				]);

				const stats: typeof ChannelStatsSchema.static = {
					videos: videoCount[0].total,
					streams: streamCount[0].total,
					shorts: shortCount[0].total,
					directorySize: dirSize.toString(),
				};

				await reply.status(200).send(stats);
			},
		);

		done();
	},
};
