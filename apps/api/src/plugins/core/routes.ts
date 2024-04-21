import { checkToken } from '../auth/tokens.js';
import { db } from '../../db/client.js';
import { channels, comments, streamComments, videos } from '../../db/schema.js';
import { getYtdlpVersion } from '../../lib/ytdlp/constants.js';
import { count } from 'drizzle-orm';
import type { FastifyPluginCallback } from 'fastify';

export const coreRoutes: FastifyPluginCallback = async (server) => {
	await server.register((instance, _, done) => {
		instance.get(
			'/heartbeat', //
			async (_, reply): Promise<void> => {
				await reply.send({ message: 'OK' });
			}
		);

		done();
	});

	await server.register((instance, _, done) => {
		instance.addHook('onRequest', checkToken);

		server.get(
			'/stats', //
			async (_, reply): Promise<void> => {
				const [chRes, vidRes, cmtRes, streamCmtRes, scanCount, downloadCount] = await Promise.all([
					db.select({ total: count() }).from(channels),
					db.select({ total: count() }).from(videos),
					db.select({ total: count() }).from(comments),
					db.select({ total: count() }).from(streamComments),
					server.tasks.scanner.getJobCountByTypes('active', 'waiting'),
					server.tasks.downloader.getJobCountByTypes('active', 'prioritized')
				]);

				await reply.send({
					channels: chRes[0].total,
					videos: vidRes[0].total,
					comments: cmtRes[0].total,
					streamComments: streamCmtRes[0].total,
					scanQueue: scanCount,
					downloadQueue: downloadCount
				});
			}
		);

		const ytdlpVersion = getYtdlpVersion();
		const apiVersion = process.env.npm_package_version;
		server.get(
			'/version', //
			async (_, reply): Promise<void> => {
				await reply.send({
					api: apiVersion,
					ytdlp: ytdlpVersion
				});
			}
		);

		done();
	});
};
