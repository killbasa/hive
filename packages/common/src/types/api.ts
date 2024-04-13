export type VersionData = {
	api: string;
	ytdlp: string;
};

export type HiveSettings = {
	id: number;
	cronSubscription: string;
	cronDownload: string;
	downloadLimit: number | null;
};
