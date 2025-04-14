<script lang="ts">
	import { parseCronExpression } from 'cron-schedule';
	import type { Cron } from 'cron-schedule';

	const timeFormatter = new Intl.DateTimeFormat('en-US', {
		dateStyle: 'long',
		timeStyle: 'long',
	});

	let {
		expression,
	}: {
		expression: string | null;
	} = $props();

	function cronPreviewText(expr: string | null): string {
		if (expr === null) {
			return 'No preview';
		}

		const value = tryParseCron(expr);

		if (value === null) {
			return 'Invalid cron expression';
		}

		let result = '';

		const next = value.getNextDates(5);
		for (const date of next) {
			result += timeFormatter.format(date.getTime()) + '\n';
		}

		return result;
	}

	function tryParseCron(value: string): Cron | null {
		try {
			return parseCronExpression(value);
		} catch {
			return null;
		}
	}
</script>

<div class="flex flex-col h-full">
	<span>Cron preview</span>
	<div class="bg-neutral text-neutral-content rounded-md p-4 h-full overflow-x-scroll">
		<pre><code>{cronPreviewText(expression)}</code></pre>
	</div>
</div>
