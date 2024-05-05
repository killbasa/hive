<script lang="ts">
	import { goto } from '$app/navigation';
	import { client } from '$lib/client';
	import { toast } from '$lib/stores/toasts';

	let username = '';
	let password = '';
	let remember = false;

	async function handleSubmit() {
		const response = await client.POST('/auth/credentials/login', {
			body: {
				username,
				password,
				remember
			}
		});

		if (response.response.ok) {
			await goto('/');
		} else {
			toast.error(response.error?.message ?? 'An error occurred');
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
