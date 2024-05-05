export type DownloadProgress = {
	status: 'downloading' | 'error' | 'finished';
	id: string;
	percentage: string;
	total: string;
	speed: string;
	eta: string;
};

// TODO Add a pre and post process step
export enum StatusEvent {
	DownloadComplete = 'DownloadComplete',
	DownloadUpdate = 'DownloadUpdate',
	DownloadCancelled = 'DownloadCancelled',
	ScanComplete = 'ScanComplete',
	ScanUpdate = 'ScanUpdate',
}

export type DownloadStatus =
	| {
			type: StatusEvent.ScanUpdate;
			channelId: string;
			channelPos: number;
			channelTotal: number;
			videoPos: number;
			videoTotal: number;
	  }
	| { type: StatusEvent.DownloadCancelled }
	| { type: StatusEvent.DownloadComplete }
	| { type: StatusEvent.DownloadUpdate; channelId: string; title: string; data: DownloadProgress }
	| { type: StatusEvent.ScanComplete };
