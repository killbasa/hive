import { RedisConnectionOptions } from '../lib/config';
import { server } from '../server';
import { handleIndexChannelTask } from '../tasks/indexer';
import { Worker } from 'bullmq';

let indexer: Worker<IndexerTasks>;

export type IndexerTasks = IndexerChannelTask | IndexerVideoTask;

export type IndexerChannelTask = { type: 'channel'; channelId: string };
export type IndexerVideoTask = { type: 'video'; channelId: string; videoId: string };

export async function initIndexerWorker(): Promise<void> {
	indexer = new Worker(
		'indexer',
		async (task) => {
			try {
				switch (task.data.type) {
					case 'channel': {
						await handleIndexChannelTask(task.data);
						return;
					}
					case 'video': {
						server.log.info('Indexing video task');
						return;
					}
				}
			} catch (err) {
				server.log.error(err);
			}

			throw new Error(`Unknown task: ${task.name}`);
		},
		{ connection: RedisConnectionOptions, concurrency: 1 }
	);

	await indexer.waitUntilReady();
}
