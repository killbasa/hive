import { db } from '../../../db/client.js';
import { videos } from '../../../db/schema.js';
import { server } from '../../../server.js';
import { fetchChannelXML, parseChannelXML } from '../xml.js';
import { Time, sleep } from '@hive/common';
import type { TaskHandler } from '../types.js';

export const handleScrapeTask: TaskHandler = async () => {
	server.log.info('scraping channel...');

	const result = await db.query.channels.findMany({
		orderBy: (channels, { asc }) => [asc(channels.updatedAt)],
		columns: { id: true },
		limit: 50
	});

	for (const channel of result) {
		const xml = await fetchChannelXML(channel.id);
		const data = parseChannelXML(xml);

		await db
			.insert(videos)
			.values(
				data.feed.entry.map((entry) => {
					return {
						id: entry['yt:videoId'],
						channelId: entry['yt:channelId'],
						title: entry.title,
						description: '',
						type: 'video' as const,
						status: 'new' as const,
						downloadStatus: 'pending' as const
					};
				})
			)
			.onConflictDoNothing({ target: videos.id });

		await sleep(Time.Second);
	}

	server.log.info(`scraped ${result.length} videos`);
};
