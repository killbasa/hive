import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser();

export type XMLString = string & { _: true };

export type FeedResponse = {
	feed: {
		title: string;
		author: {
			name: string;
			uri: string;
		};
		published: string;
		entry: FeedEntry[];
	};
};

export type FeedEntry = {
	'yt:videoId': string;
	'yt:channelId': string;
	title: string;
	published: string;
	updated: string;
};

export async function fetchChannelXML(channelId: string): Promise<XMLString> {
	const url = new URL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);

	const response = await fetch(url.href, {
		method: 'GET'
	});
	const xml = await response.text();

	return xml as XMLString;
}

export function parseChannelXML(xml: XMLString): FeedResponse {
	return parser.parse(xml);
}
