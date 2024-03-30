import { db } from '../db/client';
import { channels, comments, videos } from '../db/schema';
import { getYtdlpVersion } from '../lib/ytdlp/constants';
import { downloader } from '../queues/downloader';
import { scanner } from '../queues/scanner';
import { count } from 'drizzle-orm';
import type { FastifyPluginCallback } from 'fastify';

export const rootRoutes: FastifyPluginCallback = (server, _, done) => {
	server.get(
		'/heartbeat', //
		async (_, reply): Promise<void> => {
			await reply.send({ message: 'OK' });
		}
	);

	server.get(
		'/stats', //
		async (_, reply): Promise<void> => {
			const [chRes, vidRes, cmtRes, scanCount, downloadCount] = await Promise.all([
				db.select({ total: count() }).from(channels),
				db.select({ total: count() }).from(videos),
				db.select({ total: count() }).from(comments),
				scanner.getJobCountByTypes('waiting', 'active'),
				downloader.getJobCountByTypes('prioritized')
			]);

			await reply.send({
				channels: chRes[0].total,
				videos: vidRes[0].total,
				comments: cmtRes[0].total,
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
};
