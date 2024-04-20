import { fetchChannelXML, parseChannelXML } from '../src/plugins/tasks/xml.js';
import { beforeAll, describe, expect, test } from 'vitest';
import type { XMLString } from '../src/plugins/tasks/xml.js';

const channelId = 'UCZlDXzGoo7d44bwdNObFacg';

describe('parseChannelXml', () => {
	let data: XMLString;

	beforeAll(async () => {
		data = await fetchChannelXML(channelId);
	});

	test('', async () => {
		const result = parseChannelXML(data);

		expect(result.feed.entry[0]['yt:channelId']).toBe(channelId);
	});
});
