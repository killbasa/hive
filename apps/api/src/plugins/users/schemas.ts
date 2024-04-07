import { z } from 'zod';

export const UserPatchSchema = z.object({
	newUsername: z.string().min(3).optional(),
	newPassword: z.string().min(8),
	oldPassword: z.string().min(8)
});
