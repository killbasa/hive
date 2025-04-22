export type DownloadProgress = {
	status: 'downloading' | 'error' | 'finished';
	id: string;
	percentage: string;
	total: string;
	speed: string;
	eta: string;
};

// TODO Add a pre and post process step
export const StatusEvent = {
	DownloadComplete: 'DownloadComplete',
	DownloadUpdate: 'DownloadUpdate',
	DownloadCancelled: 'DownloadCancelled',
	ScanComplete: 'ScanComplete',
	ScanUpdate: 'ScanUpdate',
} as const;
export type StatusEventType = (typeof StatusEvent)[keyof typeof StatusEvent];

export type DownloadStatus =
	| {
			type: typeof StatusEvent.ScanUpdate;
			channelId: string;
			channelPos: number;
			channelTotal: number;
			videoPos: number;
			videoTotal: number;
	  }
	| { type: typeof StatusEvent.DownloadCancelled }
	| { type: typeof StatusEvent.DownloadComplete }
	| { type: typeof StatusEvent.DownloadUpdate; channelId: string; title: string; data: DownloadProgress }
	| { type: typeof StatusEvent.ScanComplete };
