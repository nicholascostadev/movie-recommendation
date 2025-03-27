<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
</script>

{#if page.status === 404}
	<div class="container mx-auto max-w-md px-4 py-16 text-center">
		<h1 class="mb-4 text-4xl font-bold tracking-tight">Page not found</h1>
		<p class="mb-8 text-muted-foreground">
			We couldn't find the page you're looking for. It may have been moved or deleted.
		</p>
		<div class="flex justify-center gap-4">
			<Button href="/problems" variant="default">Go to problems</Button>
		</div>
	</div>
{:else}
	<div class="container mx-auto max-w-md px-4 py-16 text-center">
		<h1 class="mb-4 text-4xl font-bold tracking-tight">Error {page.status}</h1>
		<p class="mb-8 text-muted-foreground">
			{page.error?.message || 'Something went wrong. Please try again later.'}
		</p>
		<div class="flex justify-center gap-4">
			<Button href="/" variant="default">Go home</Button>
			<Button onclick={() => window.history.back()} variant="outline">Go back</Button>
		</div>
	</div>
{/if}
