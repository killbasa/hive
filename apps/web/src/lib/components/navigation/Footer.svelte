<script lang="ts">
	import { config } from '$lib/config';
</script>

<div class="h-24 bg-slate-800 text-slate-50 flex justify-center items-center">
	<nav>
		<ul class="flex gap-2">
			<a href="https://github.com/killbasa/hive" target="_blank">
				<li class="float-right link-hover">Source code</li>
			</a>
			<li>•</li>
			<a href="{config.apiUrl}/reference" target="_blank">
				<li class="float-right link-hover">API Reference</li>
			</a>
		</ul>
	</nav>
</div>
