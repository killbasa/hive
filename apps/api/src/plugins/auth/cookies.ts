import { isDev } from '../../lib/constants.js';
import { server } from '../../server.js';
import { Time } from '@hive/common';
import type { CookieSerializeOptions } from '@fastify/cookie';

const cookieDomain = new URL(server.config.auth.origin).hostname;

export const cookies = {
	create(options: { extendedExpiry: boolean } = { extendedExpiry: true }): CookieSerializeOptions {
		const offset = options.extendedExpiry //
			? Time.Day * 30
			: Time.Week;

		return {
			// Don't set domain for localhost
			domain: isDev ? undefined : cookieDomain,
			path: '/',
			secure: 'auto',
			httpOnly: true,
			sameSite: 'strict',
			expires: new Date(Date.now() + offset),
			signed: false,
		};
	},
	delete(): CookieSerializeOptions {
		return {
			domain: isDev ? undefined : cookieDomain,
			path: '/',
		};
	},
};
