<script lang="ts">
	import { authClient } from '@/auth-client';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import * as Form from '@/components/ui/form';
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
	import { registerFormSchema } from './schema';

	const { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(registerFormSchema),
		onUpdate: async ({ form }) => {
			if (form.valid) {
				await handleEmailRegister({
					email: form.data.email,
					password: form.data.password,
					name: form.data.name,
					username: form.data.username
				});
			}
		},
		SPA: true
	});

	const { form: formData, enhance, submitting } = form;

	async function handleEmailRegister({
		email,
		password,
		name,
		username
	}: {
		email: string;
		password: string;
		name: string;
		username: string;
	}) {
		try {
			await authClient.signUp.email({
				email,
				password,
				name,
				username,
				fetchOptions: {
					onSuccess: () => {
						goto('/movies');
					}
				}
			});
		} catch (error) {
			console.error('Registration failed:', error);
		}
	}

	async function handleGithubRegister() {
		try {
			await authClient.signIn.social({ provider: 'github' });
		} catch (error) {
			console.error('GitHub registration failed:', error);
		}
	}
</script>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
	<form method="POST" use:enhance class="flex w-full justify-center">
		<Card class="w-full max-w-md">
			<CardHeader class="space-y-1">
				<CardTitle class="text-2xl font-bold">Create an account</CardTitle>
				<CardDescription>Enter your details to create your account</CardDescription>
			</CardHeader>
			<CardContent class="space-y-4">
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Name</Form.Label>
							<Input {...props} placeholder="John Doe" bind:value={$formData.name} />
						{/snippet}
					</Form.Control>

					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="username">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Username</Form.Label>
							<Input {...props} placeholder="johndoe" bind:value={$formData.username} />
						{/snippet}
					</Form.Control>

					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input {...props} placeholder="john@doe.com" bind:value={$formData.email} />
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
			</CardContent>
			<CardFooter class="flex flex-col space-y-4">
				<Form.Button class="w-full" disabled={$submitting}>
					{#if $submitting}
						Creating account...
					{:else}
						Create account
					{/if}
				</Form.Button>
				<div class="relative flex items-center justify-center">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t"></span>
					</div>
					<span class="relative bg-card px-2 text-sm text-muted-foreground">Or continue with</span>
				</div>
				<Button type="button" variant="outline" class="w-full" onclick={handleGithubRegister}>
					<GithubIcon class="mr-2 h-4 w-4" />
					GitHub
				</Button>
				<div class="text-center text-sm">
					Already have an account?
					<a href="/login" class="text-primary hover:underline">Sign in</a>
				</div>
			</CardFooter>
		</Card>
	</form>
</div>

<!-- <SuperDebug data={form} /> -->
