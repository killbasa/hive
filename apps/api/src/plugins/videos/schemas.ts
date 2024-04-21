import { QueryParamArray } from '../../lib/params.js';
import { VideoDownloadStatus, VideoStatus, VideoType } from '../../lib/types.js';
import { z } from 'zod';

export const VideoQuerySchema = z.object({
	page: z.coerce.number().default(1),
	type: QueryParamArray(VideoType),
	status: QueryParamArray(VideoStatus),
	downloadStatus: QueryParamArray(VideoDownloadStatus),
	channelId: z.string().optional(),
	search: z.string().optional(),
	inProgress: z.coerce.boolean().default(false)
});

export const VideoIgnoreSchema = z.object({
	videoIds: z.array(z.string())
});

export const VideoPatchSchema = z.object({
	downloadStatus: z.enum(['ignored', 'pending'])
});

export const VideoProgressSchema = z.object({
	progress: z.number()
});
