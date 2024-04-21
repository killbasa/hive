import { z } from 'zod';

export const UserPatchSchema = z.object({
	newPassword: z.string().min(8),
	oldPassword: z.string().min(8)
});
