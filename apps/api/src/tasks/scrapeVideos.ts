import { db } from '../db/client';
import { videos } from '../db/schema';
import { Time, sleep } from '../lib/utils';
import { fetchChannelXML, parseChannelXML } from '../lib/xml';
import { server } from '../server';

export async function handleScrapeTask(): Promise<void> {
	server.log.debug('Syncing videos...');

	const result = await db.query.channels.findMany({
		orderBy: (channels, { asc }) => [asc(channels.updatedAt)],
		columns: { id: true },
		limit: 50
	});

	for (const channel of result) {
		const xml = await fetchChannelXML(channel.id);
		const data = parseChannelXML(xml);

		console.log(data.feed.entry[0]);

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

	server.log.info(`Synced ${result.length} videos`);
}
