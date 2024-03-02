import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser();

type XMLString = string & { _: true };

export async function fetchChannelXML(channelId: string): Promise<XMLString> {
	const url = new URL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);

	const response = await fetch(url.href);
	const xml = await response.text();

	return xml as XMLString;
}

export function parseChannelXML(xml: XMLString): Record<string, unknown> {
	return parser.parse(xml);
}
