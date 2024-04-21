import type { videos } from '../db/schema.js';

export type VideoType = (typeof videos.$inferSelect)['type'];
export const VideoType: VideoType[] = ['video', 'short', 'stream'] as const;

export type VideoStatus = (typeof videos.$inferSelect)['status'];
export const VideoStatus: VideoStatus[] = ['none', 'new', 'live', 'upcoming', 'past'] as const;

export type VideoDownloadStatus = (typeof videos.$inferSelect)['downloadStatus'];
export const VideoDownloadStatus: VideoDownloadStatus[] = ['ignored', 'pending', 'done'] as const;
