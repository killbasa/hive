import type { StatusEvent } from '../utils';

export type DownloadProgress = {
	status: 'downloading' | 'error' | 'finished';
	id: string;
	percentage: string;
	total: string;
	speed: string;
	eta: string;
};

export type DownloaderVideoTask =
	| {
			id: string;
			channelId: string;
			title: string;
	  }
	| undefined;

export type DownloadStatus =
	| { type: StatusEvent.DownloadCancelled }
	| { type: StatusEvent.DownloadUpdate; channelId: string; title: string; data: DownloadProgress }
	| { type: StatusEvent.ScanComplete }
	| {
			type: StatusEvent.ScanUpdate;
			channelId: string;
			channelPos: number;
			channelTotal: number;
			videoPos: number;
			videoTotal: number;
	  };
