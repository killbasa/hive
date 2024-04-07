import { z } from 'zod';

export const SettingsPatchSchema = z.object({
	cronSubscription: z.string().min(9).optional(),
	cronDownload: z.string().min(9).optional(),
	downloadLimit: z.number().optional()
});
