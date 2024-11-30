<script lang="ts">
	import { client } from '$lib/client';
	import { toast } from '$lib/stores/toasts';
	import type { FormEventHandler } from 'svelte/elements';
	import { goto } from '$app/navigation';

	let username = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let disabled = $derived(username === '' || password === '' || password !== confirmPassword);

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();

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
	};
</script>

<svelte:head>
	<title>Setup</title>
</svelte:head>

<div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 flex flex-col items-center">
	<h1>Hive</h1>
	<form onsubmit={handleSubmit} class="flex flex-col gap-2 w-80">
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
