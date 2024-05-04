import createClient from 'openapi-fetch';
import type { paths } from '../api';
import { config } from './config';

export const client = createClient<paths>({
	baseUrl: config.apiUrl,
	credentials: 'include'
});
