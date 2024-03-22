export type YouTubeChannelList = {
	items: YouTubeChannel[];
};

export type YouTubeChannel = {
	id: string;
	snippet: YouTubeChannelSnippet;
	brandingSettings: YouTubeChannelBranding;
};

export type YouTubeChannelSnippet = {
	title: string;
	description: string;
	customUrl: string;
	thumbnails: {
		high: {
			url: string;
			width: number;
			height: number;
		};
	};
};

export type YouTubeChannelBranding = {
	channel: {
		keywords: string;
	};
	image: {
		bannerExternalUrl: string;
	};
};
