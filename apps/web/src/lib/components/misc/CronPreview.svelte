<script lang="ts">
	import cron from 'cron-parser';

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

		for (let i = 0; i < 5; i++) {
			result += timeFormatter.format(value?.next().getTime()) + '\n';
		}

		return result;
	}

	function tryParseCron(value: string): cron.CronExpression | null {
		try {
			return cron.parseExpression(value);
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
