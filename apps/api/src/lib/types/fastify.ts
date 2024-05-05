import 'fastify';
import '@fastify/jwt';

import type { Queue } from 'bullmq';
import type { RegisterOptions } from 'fastify';
import type { HiveNotifier } from '../../plugins/notifications/emitter.js';
import type { HiveSettings } from '../../plugins/settings/service.js';
import type { DownloaderTasks, ScannerTasks } from '../../plugins/tasks/types.js';
import type { HiveMetrics } from '../otel/MetricsClient.js';
import type { HiveRoutes } from './hive.js';

declare module 'fastify' {
	interface FastifyInstance {
		registerRoutes: (routes: HiveRoutes, options?: RegisterOptions) => Promise<void>;
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
