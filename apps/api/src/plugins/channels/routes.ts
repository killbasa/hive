import { Type } from '@fastify/type-provider-typebox';
import { count } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { channels } from '../../db/schema.js';
import { EmptyResponse, MessageResponse } from '../../lib/responses.js';
import type { HiveRoutes } from '../../lib/types/hive.js';
import { doesChannelExist, parseTags } from '../../lib/youtube/channels.js';
import { ChannelPostBody } from './body.js';
import { ChannelQuerySchema } from './query.js';
import { ChanneListSchema, ChannelSchema } from './schema.js';

export const channelRoutes: HiveRoutes = {
	authenticated: (server, _, done) => {
		server.get(
			'', //
			{
				schema: {
					description: 'Get a list of channels',
					tags: ['Channels'],
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

		server.post(
			'', //
			{
				schema: {
					description: 'Add a channel',
					tags: ['Channels'],
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

				await server.tasks.scanner.add(`channel/${body.id}/download`, {
					type: 'channel',
					channelId: body.id,
				});

				await reply.status(201).send();
			},
		);

		server.get<{ Params: { channelId: string } }>(
			'/:channelId', //
			{
				schema: {
					description: 'Get a channel',
					tags: ['Channels'],
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

		done();
	},
};
