import { db } from '../../../db/client';
import { videos } from '../../../db/schema';
import { Time } from '../../../lib/constants';
import { sleep } from '../../../lib/utils';
import { server } from '../../../server';
import { fetchChannelXML, parseChannelXML } from '../xml';

export async function handleScrapeTask(): Promise<void> {
	server.log.info('syncing videos...');

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

	server.log.info(`synced ${result.length} videos`);
}
