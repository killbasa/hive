<script lang="ts">
	import { client } from '$lib/client';
	import { toast } from '$lib/stores/toasts';
	import { goto } from '$app/navigation';

	let username = '';
	let password = '';
	let confirmPassword = '';
	$: disabled = username === '' || password === '' || password !== confirmPassword;

	async function handleSubmit() {
		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}

		const { response, error } = await client.PUT('/auth/credentials/signup', {
			body: {
				username,
				password,
			},
		});

		if (response.ok) {
			toast.success('Account created');
			await goto('/login');
		} else if (response.status === 403) {
			toast.error('User registration is disabled');
		} else if (response.status === 409) {
			toast.error('User already exists');
		} else {
			toast.error(error?.message ?? 'An error occurred');
		}
	}
</script>

<svelte:head>
	<title>Setup</title>
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
		<input
			type="password"
			name="password"
			placeholder="Confirm password"
			class="input input-bordered focus:input-primary"
			bind:value={confirmPassword}
		/>
		<button type="submit" class="btn btn-neutral" {disabled}>Create account</button>
		<a href="/login" class="link link-primary mx-auto">Back to login</a>
	</form>
</div>
