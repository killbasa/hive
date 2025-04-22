export const Time = {
	Second: 1000,
	Minute: 60 * 1000,
	Hour: 60 * 60 * 1000,
	Day: 24 * 60 * 60 * 1000,
	Week: 7 * 24 * 60 * 60 * 1000,
	Month: (365 / 12) * 24 * 60 * 60 * 1000,
	Year: 365 * 24 * 60 * 60 * 1000,
} as const;
export type Time = (typeof Time)[keyof typeof Time];
