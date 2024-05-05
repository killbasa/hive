import type { Awaitable } from '../../lib/types/generic.js';

export type TaskHandler<T = void> = T extends void //
	? () => Awaitable<void>
	: (task: T) => Awaitable<void>;

export type ScannerTasks = ScannerDownloadChannelTask | ScannerScanChannelTask;

export type ScannerDownloadChannelTask = { type: 'channel'; channelId: string };

export type ScannerScanChannelTask = { type: 'scan'; channelId: string; position: number; total: number };

export type DownloaderTasks = DownloaderVideoTask;

export type DownloaderVideoTask = { type: 'video'; videoId: string; channelId: string; live: boolean };
