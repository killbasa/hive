import { db } from '../db/client';
import { channels, comments, videos } from '../db/schema';
import { getYtdlpVersion } from '../lib/ytdlp/constants';
import { sql } from 'drizzle-orm';
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
			const [chRes, vidRes, cmtRes] = await Promise.all([
				db.select({ total: sql`COUNT(*)` }).from(channels), //
				db.select({ total: sql`COUNT(*)` }).from(videos),
				db.select({ total: sql`COUNT(*)` }).from(comments)
			]);

			await reply.send({
				channels: chRes[0].total,
				videos: vidRes[0].total,
				comments: cmtRes[0].total
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
