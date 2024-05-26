import { HiveGauges } from './Gauges.js';
import { config } from '../config.js';
import { PrometheusExporter, PrometheusSerializer } from '@opentelemetry/exporter-prometheus';
import { metrics, resources } from '@opentelemetry/sdk-node';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
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
			resource: new resources.Resource({
				[SEMRESATTRS_SERVICE_NAME]: 'hive',
				[SEMRESATTRS_SERVICE_VERSION]: config.VERSION,
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
}
