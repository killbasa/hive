/* eslint-disable @typescript-eslint/consistent-type-definitions */

import 'fastify';
import '@fastify/session';

import type { Queue } from 'bullmq';
import type { RegisterOptions } from 'fastify';
import type { HiveNotifier } from '../../plugins/notifications/emitter.js';
import type { HiveSettings } from '../../plugins/settings/service.js';
import type { DownloaderTasks, ScannerTasks } from '../../tasks/types.js';
import type { HiveMetrics } from '../otel/MetricsClient.js';
import type { HiveRoutes } from './hive.js';
import type { HiveConfig } from '../config.js';

declare module 'fastify' {
	interface FastifyInstance {
		routes: (routes: HiveRoutes, options?: RegisterOptions) => Promise<void>;
		settings: HiveSettings;
		config: HiveConfig;
		notifications: HiveNotifier;
		metrics?: HiveMetrics;
		tasks: {
			internal: Queue;
			downloader: Queue<DownloaderTasks>;
			scanner: Queue<ScannerTasks>;
		};
	}

	interface Session {
		user: {
			id: number;
			name: string;
		};
	}
}
