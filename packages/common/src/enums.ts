/* eslint-disable @typescript-eslint/prefer-literal-enum-member */

export enum Time {
	Second = 1000,
	Minute = 60 * Second,
	Hour = 60 * Minute,
	Day = 24 * Hour,
	Week = 7 * Day,
	Month = (365 / 12) * Day,
	Year = 365 * Day,
}
