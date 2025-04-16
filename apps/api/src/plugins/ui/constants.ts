import { isDev } from '../../lib/constants.js';

export const UiContentSecurityPolicies: string = [
	"default-src 'none'", //
	"script-src-elem 'self' 'unsafe-inline'",
	"script-src 'self'",
	"style-src 'self' 'unsafe-inline'",
	"font-src 'self'",
	"connect-src 'self' ws:",
	"img-src 'self' data:",
	"media-src 'self'",
	"manifest-src 'self'",
	...(isDev ? ['report-uri /api/csp'] : []),
].join('; ');
