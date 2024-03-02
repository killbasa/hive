export async function channelExists(channelId: string): Promise<boolean> {
	const url = new URL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);

	const response = await fetch(url.href, {
		method: 'HEAD'
	});

	return response.status === 200;
}
