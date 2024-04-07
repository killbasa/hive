/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */

import 'fastify';
import '@fastify/jwt';

import type { Queue } from 'bullmq';
import type { ScannerTasks } from '../../plugins/tasks/workers/scanner';
import type { DownloaderTasks } from '../../plugins/tasks/workers/downloader';

declare module 'fastify' {
	interface FastifyInstance {
		tasks: {
			scanner: Queue<ScannerTasks>;
			downloader: Queue<DownloaderTasks>;
			internal: Queue;
		};
	}
}

declare module '@fastify/jwt' {
	interface FastifyJWT {
		// Signing and verifying tokens
		payload: {
			name: string;
		};
		// User object
		user: {
			name: string;
		};
	}
}
