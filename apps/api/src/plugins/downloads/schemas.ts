import { z } from 'zod';

export const DownloadStartSchema = z.object({
	videoIds: z.array(z.string()).optional()
});
