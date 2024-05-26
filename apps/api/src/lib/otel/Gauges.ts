/* eslint-disable @typescript-eslint/no-extraneous-class */

import { db } from '../../db/client.js';
import { channels, comments, playlists, videos } from '../../db/schema.js';
import { count } from 'drizzle-orm';
import type { Meter } from '@opentelemetry/api';

export class HiveGauges {
	public constructor(meter: Meter) {
		meter
			.createObservableGauge('hive_channels_total', {
				description: 'Gauge for the total amount of channels.',
			})
			.addCallback(async (gauge) => {
				const result = await db.select({ total: count() }).from(channels);
				gauge.observe(result[0].total);
			});

		meter
			.createObservableGauge('hive_playlists_total', {
				description: 'Gauge for the total amount of playlists.',
			})
			.addCallback(async (gauge) => {
				const result = await db.select({ total: count() }).from(playlists);
				gauge.observe(result[0].total);
			});

		meter
			.createObservableGauge('hive_videos_total', {
				description: 'Gauge for the total amount of videos.',
			})
			.addCallback(async (gauge) => {
				const result = await db.select({ total: count() }).from(videos);
				gauge.observe(result[0].total);
			});

		meter
			.createObservableGauge('hive_comments_total', {
				description: 'Gauge for the total amount of comments.',
			})
			.addCallback(async (gauge) => {
				const result = await db.select({ total: count() }).from(comments);
				gauge.observe(result[0].total);
			});
	}
}
