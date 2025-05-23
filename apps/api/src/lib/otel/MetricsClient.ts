import { HiveGauges } from './Gauges.js';
import { server } from '../../server.js';
import { PrometheusExporter, PrometheusSerializer } from '@opentelemetry/exporter-prometheus';
import { metrics, resources } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import type { Meter } from '@opentelemetry/api';

export class HiveMetrics {
	public readonly gauges: HiveGauges;

	private readonly exporter: PrometheusExporter;
	private readonly serializer: PrometheusSerializer;
	private readonly provider: metrics.MeterProvider;

	public constructor() {
		this.exporter = new PrometheusExporter({
			preventServerStart: true,
		});

		this.serializer = new PrometheusSerializer();

		this.provider = new metrics.MeterProvider({
			resource: resources.resourceFromAttributes({
				[ATTR_SERVICE_NAME]: 'hive',
				[ATTR_SERVICE_VERSION]: server.config.server.version,
			}),
			readers: [this.exporter],
		});

		this.gauges = new HiveGauges(this.getMeter());
	}

	public async destroy(): Promise<void> {
		await this.exporter.shutdown();
		await this.provider.shutdown();
	}

	public getMeter(): Meter {
		return this.provider.getMeter('metrics');
	}

	public async collect(): Promise<string> {
		const data = await this.exporter.collect();
		return this.serializer.serialize(data.resourceMetrics);
	}

	public static readonly contentType = 'text/plain; version=0.0.4; charset=utf-8';
}
