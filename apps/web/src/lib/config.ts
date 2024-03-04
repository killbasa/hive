export type Config = {
	apiUrl: string;
};

export const config: Config = {
	apiUrl: import.meta.env.VITE_API_URL ?? 'localhost:3001'
};
