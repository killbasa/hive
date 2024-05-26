export type KeyOf<T extends Record<string, unknown>> = (keyof T)[][number];

export type ExcludeKeys<T extends Record<string, unknown>, K extends KeyOf<T>> = Omit<T, K>;
