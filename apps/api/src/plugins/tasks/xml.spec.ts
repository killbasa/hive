import { Time } from '@hive/common';
import { beforeAll, describe, expect, test } from 'vitest';
import { cache } from '../../tests/fs.test-util.js';
import { fetchChannelXML, parseChannelXML } from './xml.js';
import type { XMLString } from './xml.js';

const channelId = 'UCZlDXzGoo7d44bwdNObFacg';
const cachePath = `${channelId}.xml`;

describe.skipIf(process.env.CI)('xml utils', () => {
	let data: string;

	beforeAll(async () => {
		data = await cache(cachePath, Time.Day, async () => {
			return await fetchChannelXML(channelId);
		});
	});

	test('Channel ID should be defined', async () => {
		const result = parseChannelXML(data as XMLString);

		expect(result.feed.entry[0]['yt:channelId']).toBe(channelId);
	});
});
