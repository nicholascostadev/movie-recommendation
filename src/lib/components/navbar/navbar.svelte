<script lang="ts">
	import { page } from '$app/state';
	import { authClient, authFetch } from '@/auth-client';
	import ProfileButton from '../profile-button/profile-button.svelte';
	import { SearchIcon, XIcon } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { clickOutside } from '$lib/actions/clickOutside';
	import { getPosterUrl, type Movie } from '@/tmdb';
	import { createQuery } from '@tanstack/svelte-query';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import { CallFunctionOnDebounce } from '@/utils/call-function-on-debounce.svelte';

	const session = authClient.useSession();

	let searchQuery = $state(page.url.searchParams.get('q') || '');
	let isDropdownOpen = $state(false);
	let isFormFocused = $state(false);
	let debouncedSearchQuery = $state(page.url.searchParams.get('q') || '');
	let formRef: HTMLFormElement | undefined = $state();
	new CallFunctionOnDebounce({
		func: () => {
			debouncedSearchQuery = searchQuery;
		},
		delay: 300,
		deps: () => [searchQuery]
	});

	const searchResult = createQuery(() => ({
		queryKey: ['search', debouncedSearchQuery, 5],
		queryFn: async () => {
			const response = await authFetch<{ results: Movie[] }>(
				`/api/search?query=${encodeURIComponent(debouncedSearchQuery)}&limit=5`,
				{
					baseURL: PUBLIC_BASE_URL
				}
			);
			if (response.error) throw new Error('Search failed');

			console.log(response.data);

			return response.data?.results;
		},
		enabled: isDropdownOpen
	}));

	function handleSearchSubmit(event: Event) {
		event.preventDefault();
		if (searchQuery.trim()) {
			goto(`/movies/search?q=${encodeURIComponent(searchQuery)}`);
			closeDropdown();
		}
	}

	function closeDropdown() {
		isDropdownOpen = false;
	}

	function clearSearch() {
		searchQuery = '';
		closeDropdown();
	}

	$effect(() => {
		const focusInHandler = (e: FocusEvent) => {
			if (formRef?.contains(e.target as Node)) {
				isFormFocused = true;

				if (searchQuery) {
					isDropdownOpen = true;
				}
			}
		};

		const focusOutHandler = (e: FocusEvent) => {
			if (!formRef?.contains(e.target as Node)) {
				isFormFocused = false;
			}
		};

		document.addEventListener('focusin', focusInHandler);
		document.addEventListener('focusout', focusOutHandler);

		return () => {
			document?.removeEventListener('focusin', focusInHandler);
			document?.removeEventListener('focusout', focusOutHandler);
		};
	});

	$effect(() => {
		if (isFormFocused && searchQuery) {
			isDropdownOpen = true;
		}
	});

	$effect(() => {
		const q = page.url.searchParams.get('q');
		if (q && page.url.pathname === '/movies/search') {
			searchQuery = q;
		}
	});
</script>

<nav class="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm">
	<div class="container mx-auto flex h-16 items-center justify-between px-4">
		<a href="/" class="flex items-center">
			<span
				class="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-xl font-bold text-transparent"
				>MovieRec</span
			>
		</a>

		<div class="flex flex-1 justify-center px-8">
			<div class="relative w-full max-w-md">
				<form
					onsubmit={handleSearchSubmit}
					class="relative"
					bind:this={formRef}
					use:clickOutside={{ callback: closeDropdown }}
				>
					<input
						bind:value={searchQuery}
						type="text"
						placeholder="Search movies..."
						class="w-full rounded-full bg-gray-800 px-4 py-2 pl-10 pr-10 text-sm text-white placeholder-gray-400 outline-none ring-1 ring-gray-700 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-gray-900"
					/>
					<div class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
						<SearchIcon size={16} />
					</div>
					{#if searchQuery}
						<button
							type="button"
							class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
							onclick={clearSearch}
						>
							<XIcon size={16} />
						</button>
					{/if}
				</form>

				{#if (isDropdownOpen && searchResult.data && searchResult.data.length > 0) || searchResult.isLoading}
					<div
						class="absolute mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 p-2 shadow-lg"
					>
						{#if searchResult.isLoading}
							<div class="flex items-center justify-center py-6">
								<div
									class="h-5 w-5 animate-spin rounded-full border-2 border-gray-500 border-t-indigo-500"
								></div>
								<span class="ml-2 text-sm text-gray-400">Searching...</span>
							</div>
						{:else if searchResult.data}
							<div class="max-h-96 overflow-y-auto">
								{#each searchResult.data as movie (movie.id)}
									<a
										href={`/movies/${movie.id}`}
										class="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-700"
										onclick={closeDropdown}
									>
										<div class="h-12 w-9 flex-shrink-0 rounded bg-gray-700">
											{#if movie.poster_path}
												<img
													src={getPosterUrl(movie.poster_path, 'w92')}
													alt={movie.title}
													class="h-full w-full rounded object-cover"
													loading="lazy"
												/>
											{:else}
												<div
													class="flex h-full w-full items-center justify-center rounded bg-gray-700 text-xs text-gray-500"
												>
													No image
												</div>
											{/if}
										</div>
										<div class="flex-1 overflow-hidden">
											<h4 class="truncate text-sm font-medium text-white">{movie.title}</h4>
											<p class="text-xs text-gray-400">
												{movie.release_date
													? new Date(movie.release_date).getFullYear()
													: 'Unknown year'}
											</p>
										</div>
									</a>
								{/each}

								<div class="mt-2 border-t border-gray-700 pt-2">
									<a
										href={`/movies/search?q=${encodeURIComponent(searchQuery)}`}
										class="flex items-center justify-center gap-1 rounded-md p-2 text-sm text-indigo-400 transition-colors hover:bg-gray-700 hover:text-indigo-300"
										onclick={closeDropdown}
									>
										Show more results
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="h-4 w-4"
										>
											<path
												fill-rule="evenodd"
												d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
												clip-rule="evenodd"
											/>
										</svg>
									</a>
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<div class="flex items-center space-x-6">
			<a
				href="/movies"
				class="text-sm font-medium transition-colors {page.url.pathname.startsWith('/movies')
					? 'text-white'
					: 'text-gray-400 hover:text-white'}"
			>
				Movies
			</a>

			<!-- Add more navigation items here in the future -->

			<!-- User button placeholder - this would be connected to your auth system -->
			{#if $session.data?.user}
				<ProfileButton />
			{:else}
				<a href="/login" class="text-sm font-medium text-gray-400 hover:text-white">Login</a>
			{/if}
		</div>
	</div>
</nav>
