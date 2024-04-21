<script lang="ts">
	import { goto } from '$app/navigation';
	import { apiFetch } from '$lib/fetch';
	import { MIMETypes } from '$lib/constants';
	import { toast } from '$lib/stores/toasts';

	let username = '';
	let password = '';
	let remember = false;

	async function handleSubmit() {
		const response = await apiFetch<{ message: string }>('/auth/credentials/login', {
			fetch,
			method: 'POST',
			headers: { 'content-type': MIMETypes.json },
			body: JSON.stringify({
				username,
				password,
				remember
			})
		});

		if (response.raw.ok) {
			await goto('/');
		} else {
			const err = await response.error();
			toast.error(err.message);
		}
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 flex flex-col items-center">
	<h1>Hive</h1>
	<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-2 w-80">
		<input
			type="text"
			name="username"
			placeholder="Username"
			class="input input-bordered focus:input-primary"
			bind:value={username}
		/>
		<input
			type="password"
			name="password"
			placeholder="Password"
			class="input input-bordered focus:input-primary"
			bind:value={password}
		/>
		<button type="submit" class="btn btn-neutral">Log in</button>
		<label class="label cursor-pointer justify-normal gap-2">
			<input type="checkbox" class="checkbox checkbox-primary" bind:checked={remember} />
			<span>Remember me</span>
		</label>
		<a href="/signup" class="link link-primary mx-auto">Create account</a>
	</form>
</div>
