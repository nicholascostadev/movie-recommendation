<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '@/auth-client';
	import { Button } from '@/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';

	let username = $state('');
	let isLoading = $state(false);
	let error = $state('');

	const session = authClient.useSession();

	// Validate username input
	function validateUsername(value: string) {
		if (!value) return 'Username is required';
		if (value.length < 3) return 'Username must be at least 3 characters';
		if (value.length > 20) return 'Username must be less than 20 characters';
		if (!/^[a-zA-Z0-9_]+$/.test(value))
			return 'Username can only contain letters, numbers, and underscores';
		if (value === 'admin') return 'Username cannot be admin';
		return '';
	}

	async function handleSubmit(
		e: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		e.preventDefault();
		error = validateUsername(username);
		if (error) return;

		isLoading = true;
		try {
			await authClient.updateUser({
				username,
				fetchOptions: {
					onSuccess: () => {
						goto('/problems');
					}
				}
			});
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to create username';
		} finally {
			isLoading = false;
		}
	}

	// Redirect if user already has a username
	$effect(() => {
		if ($session.data?.user.username) {
			goto('/problems');
		}
	});
</script>

<div class="flex min-h-[calc(100lvh-4rem)] flex-col items-center justify-center p-4">
	<Card class="max-w-md">
		<CardHeader>
			<CardTitle>Create a username</CardTitle>
			<CardDescription>
				You're almost there! Please create a username to complete your account setup.
			</CardDescription>
		</CardHeader>

		<CardContent>
			<form onsubmit={handleSubmit} class="space-y-4">
				<div class="space-y-2">
					<Label for="username">Username</Label>
					<Input
						type="text"
						id="username"
						bind:value={username}
						placeholder="Choose a username"
						autocomplete="off"
					/>
					{#if error}
						<p class="mt-1 text-sm text-red-600">{error}</p>
					{/if}
				</div>

				<Button type="submit" disabled={isLoading} class="w-full">
					{#if isLoading}
						Creating...
					{:else}
						Create Username
					{/if}
				</Button>
			</form>
		</CardContent>
	</Card>
</div>
