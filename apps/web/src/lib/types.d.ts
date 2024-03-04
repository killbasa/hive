export type Awaitable<T> = T | Promise<T>;

export type Channel = {
	id: string;
	customUrl: string;
	name: string;
	photo: string;
};

export type Video = {
	id: string;
	status: 'none' | 'new' | 'live' | 'upcoming' | 'past';
	title: string;
	channelId: string;
	thumbnail: string;
};
