import { z } from 'zod';

export const SettingsPatchSchema = z.object({
	cronSubscription: z.string().optional(),
	cronDownload: z.string().optional(),
	downloadLimit: z.number().optional()
});
