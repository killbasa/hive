import { z } from 'zod';

export const QueryParamArray = <T extends string>(arr: T[]) => {
	return z
		.string()
		.optional()
		.transform((str) => str?.split(','))
		.refine((data): data is T[] | undefined => {
			if (data === undefined) {
				return true;
			}

			return data.every((item) => arr.includes(item as T));
		});
};
