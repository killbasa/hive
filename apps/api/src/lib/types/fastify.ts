/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */

import 'fastify';
import '@fastify/jwt';

import type { Queue } from 'bullmq';
import type { HiveSettings } from '../../plugins/settings/service.js';
import type { DownloaderTasks, ScannerTasks } from '../../plugins/tasks/types.js';
import type { HiveNotifier } from '../../plugins/notifications/emitter.js';
import type { HiveMetrics } from '../otel/MetricsClient.js';

declare module 'fastify' {
	interface FastifyInstance {
		settings: HiveSettings;
		notifications: HiveNotifier;
		metrics?: HiveMetrics;
		tasks: {
			internal: Queue;
			downloader: Queue<DownloaderTasks>;
			scanner: Queue<ScannerTasks>;
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
