/* eslint-disable @typescript-eslint/no-explicit-any */

export const logger = {
	info: (message?: any, ...optionalParams: any[]) => {
		console.log('[hive]', message, ...optionalParams);
	},
	error: (message?: any, ...optionalParams: any[]) => {
		console.error('[hive]', message, ...optionalParams);
	},
	warn: (message?: any, ...optionalParams: any[]) => {
		console.warn('[hive]', message, ...optionalParams);
	},
	debug: (message?: any, ...optionalParams: any[]) => {
		console.debug('[hive]', message, ...optionalParams);
	},
};
