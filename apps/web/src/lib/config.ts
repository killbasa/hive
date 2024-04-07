import { z } from 'zod';

const ConfigSchema = z.object({
	apiUrl: z.string().default('http://localhost:3001')
});

export const config = ConfigSchema.parse({
	apiUrl: import.meta.env.VITE_API_URL
});
