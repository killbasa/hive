import { db } from '../../db/sqlite.js';
import { server } from '../../server.js';

export async function scanAllChannels(): Promise<void> {
	const channels = await db.query.channels.findMany({
		columns: { id: true },
	});

	for (const [index, channel] of channels.entries()) {
		await server.tasks.scanner.add(
			`channel/${channel.id}/scan`,
			{
				type: 'scan',
				channelId: channel.id,
				position: index,
				total: channels.length,
			},
			{ jobId: `channel/${channel.id}/scan` },
		);
	}
}
