import type { DownloadStatus } from '@hive/common';

export type HiveNotifications = {
	livestream: { status: 'end' | 'start'; videoId: string; title: string };
	status: DownloadStatus;
};
