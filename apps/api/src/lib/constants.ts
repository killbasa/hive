/* eslint-disable @typescript-eslint/prefer-literal-enum-member */

export const DATA_DIR = 'data';
export const DOWNLOADS_DIR = `${DATA_DIR}/downloads`;
export const MEDIA_DIR = `${DATA_DIR}/media`;

export const isDev = process.env.NODE_ENV !== 'production';

export const enum Time {
	Second = 1000,
	Minute = 60 * Second,
	Hour = 60 * Minute,
	Day = 24 * Hour,
	Week = 7 * Day
}

export enum StatusEvent {
	DownloadComplete = 'DownloadComplete',
	DownloadUpdate = 'DownloadUpdate',
	DownloadCancelled = 'DownloadCancelled',
	ScanComplete = 'ScanComplete',
	ScanUpdate = 'ScanUpdate'
}
