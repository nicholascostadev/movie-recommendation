<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { GithubIcon } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginFormSchema } from './schema';

	const { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(loginFormSchema),
		onUpdate: async ({ form }) => {
			if (form.valid) {
				await handleEmailLogin({
					username: form.data.username,
					password: form.data.password
				});
			}
		},
		SPA: true
	});

	const { form: formData, enhance, submitting } = form;

	async function handleEmailLogin({ username, password }: { username: string; password: string }) {
		try {
			await authClient.signIn.username({
				username,
				password,
				fetchOptions: {
					onSuccess: () => {
						goto('/movies');
					}
				}
			});
		} catch (error) {
			console.error('Login failed:', error);
		}
	}

	async function handleGithubLogin() {
		try {
			await authClient.signIn.social({ provider: 'github', callbackURL: '/finish-oauth' });
		} catch (error) {
			console.error('GitHub login failed:', error);
		}
	}
</script>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
	<form method="POST" use:enhance class="flex w-full justify-center">
		<Card class="w-full max-w-md">
			<CardHeader class="space-y-1">
				<CardTitle class="text-2xl font-bold">Login</CardTitle>
				<CardDescription>Enter your credentials to access your account</CardDescription>
			</CardHeader>
			<CardContent class="space-y-4">
				<Form.Field {form} name="username">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Username</Form.Label>
							<Input {...props} placeholder="johndoe" bind:value={$formData.username} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Password</Form.Label>
							<Input
								{...props}
								type="password"
								placeholder="********"
								bind:value={$formData.password}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<div class="flex items-center justify-between">
					<a href="/forgot-password" class="text-sm text-primary hover:underline"
						>Forgot password?</a
					>
				</div>
			</CardContent>
			<CardFooter class="flex flex-col space-y-4">
				<Form.Button class="w-full" disabled={$submitting}>
					{#if $submitting}
						Logging in...
					{:else}
						Login
					{/if}
				</Form.Button>
				<div class="relative flex items-center justify-center">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t"></span>
					</div>
					<span class="relative bg-card px-2 text-sm text-muted-foreground">Or continue with</span>
				</div>
				<Button type="button" variant="outline" class="w-full" onclick={handleGithubLogin}>
					<GithubIcon class="mr-2 h-4 w-4" />
					GitHub
				</Button>
				<div class="text-center text-sm">
					Don't have an account?
					<a href="/register" class="text-primary hover:underline">Sign up</a>
				</div>
			</CardFooter>
		</Card>
	</form>
</div>
