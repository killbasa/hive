/* eslint-disable @typescript-eslint/consistent-type-definitions */

import type { StatusEvent } from './utils';
import type { YtdlpProgress } from './ytdlp/cli';

interface WSEvents {
	livestream: { status: 'end' | 'start'; videoId: string; title: string };
	status:
		| { type: StatusEvent.DownloadCancelled }
		| { type: StatusEvent.DownloadUpdate; channelId: string; title: string; data: YtdlpProgress }
		| { type: StatusEvent.ScanComplete }
		| { type: StatusEvent.ScanUpdate; channelId: string; current: number; total: number };
}

declare module '@types/ws' {
	interface Server {
		on<T extends keyof WSEvents>(event: T, listener: (data: WSEvents[T]) => void): this;
		off<T extends keyof WSEvents>(event: T, listener: (data: WSEvents[T]) => void): this;
		emit<T extends keyof WSEvents>(event: T, data: WSEvents[T]): boolean;
	}
}
