<script lang="ts">
	import { authClient } from '@/auth-client.js';
	import { rateMovie, removeRating } from '@/stores/ratings.svelte.js';

	import { getBackdropUrl, getPosterUrl, getProfileUrl, type MovieDetails } from '@/tmdb.js';
	import { ArrowLeftIcon, PlayIcon, ThumbsDownIcon, ThumbsUpIcon } from '@lucide/svelte';

	let { data } = $props();

	let movie: MovieDetails = data.movie;
	let userRating = data.userRating;
	let isLiked = $state(userRating ? userRating.liked : undefined);
	const session = authClient.useSession();

	const isAuthenticated = $derived(!!$session.data?.user);

	const backdropUrl = getBackdropUrl(movie.backdrop_path) || '/placeholder-backdrop.jpg';
	const posterUrl = getPosterUrl(movie.poster_path, 'original') || '/placeholder-poster.jpg';

	// Format release year
	const releaseYear = new Date(movie.release_date).getFullYear();

	// Format runtime to hours and minutes
	const hours = Math.floor(movie.runtime / 60);
	const minutes = movie.runtime % 60;
	const formattedRuntime = `${hours}h ${minutes}m`;

	// Get director
	const director = movie.credits.crew.find((person) => person.job === 'Director');

	// Get trailer
	const trailer = movie.videos.results.find(
		(video) => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
	);

	// Get cast (limit to 6)
	const cast = movie.credits.cast.slice(0, 6);

	function handleLike() {
		if (isLiked === true) {
			removeRating(movie.id.toString());
			isLiked = undefined;
		} else {
			rateMovie(movie.id.toString(), true);
			isLiked = true;
		}
	}

	function handleDislike() {
		if (isLiked === false) {
			removeRating(movie.id.toString());
			isLiked = undefined;
		} else {
			rateMovie(movie.id.toString(), false);
			isLiked = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-900 text-white">
	<!-- Hero section with backdrop -->
	<div class="relative">
		<div class="absolute inset-0">
			<img src={backdropUrl} alt={`${movie.title} backdrop`} class="h-full w-full object-cover" />
			<div
				class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/30"
			></div>
		</div>

		<div class="container relative z-10 mx-auto px-4 py-12">
			<div class="flex flex-col gap-8 md:flex-row">
				<!-- Poster -->
				<div class="w-full flex-shrink-0 md:w-1/3 lg:w-1/4">
					<div class="relative overflow-hidden rounded-lg shadow-2xl">
						<img src={posterUrl} alt={`${movie.title} poster`} class="h-auto w-full" />

						<!-- Rating buttons -->
						{#if isAuthenticated}
							<div class="absolute right-4 top-4 flex gap-2">
								<button
									onclick={handleLike}
									class="flex h-12 w-12 items-center justify-center rounded-full bg-black/70 transition-colors hover:bg-black/90 {isLiked ===
									true
										? 'text-green-500'
										: 'text-white'}"
									aria-label="Like movie"
								>
									<ThumbsUpIcon fill={isLiked ? 'currentColor' : 'none'} size="24" />
								</button>
								<button
									onclick={handleDislike}
									class="flex h-12 w-12 items-center justify-center rounded-full bg-black/70 transition-colors hover:bg-black/90 {isLiked ===
									false
										? 'text-red-500'
										: 'text-white'}"
									aria-label="Dislike movie"
								>
									<ThumbsDownIcon fill={isLiked === false ? 'currentColor' : 'none'} size="24" />
								</button>
							</div>
						{/if}
					</div>
				</div>

				<!-- Movie details -->
				<div class="flex-1">
					<h1 class="text-4xl font-bold md:text-5xl">
						{movie.title} <span class="text-gray-400">({releaseYear})</span>
					</h1>

					{#if movie.tagline}
						<p class="mt-2 text-xl italic text-gray-400">"{movie.tagline}"</p>
					{/if}

					<div class="mt-4 flex flex-wrap items-center gap-4 text-gray-300">
						{#if movie.release_date}
							<span>{new Date(movie.release_date).toLocaleDateString()}</span>
						{/if}

						{#if movie.runtime}
							<span>• {formattedRuntime}</span>
						{/if}

						{#if movie.genres.length}
							<span>• {movie.genres.map((g) => g.name).join(', ')}</span>
						{/if}
					</div>

					<!-- User rating / TMDB rating -->
					<div class="mt-6 flex items-center gap-6">
						<div class="flex items-center">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 font-bold text-gray-900"
							>
								{movie.vote_average.toFixed(1)}
							</div>
							<div class="ml-2">
								<div class="text-sm text-gray-400">TMDB Rating</div>
								<div class="text-xs text-gray-500">{movie.vote_count.toLocaleString()} votes</div>
							</div>
						</div>

						{#if isLiked !== undefined}
							<div class="flex items-center">
								<div
									class="h-12 w-12 rounded-full {isLiked
										? 'bg-green-500'
										: 'bg-red-500'} flex items-center justify-center text-white"
								>
									{#if isLiked}
										<ThumbsUpIcon fill="currentColor" size="24" />
									{:else}
										<ThumbsDownIcon fill="currentColor" size="24" />
									{/if}
								</div>
								<div class="ml-2">
									<div class="text-sm text-gray-400">Your Rating</div>
									<div class="text-xs text-gray-500">{isLiked ? 'Liked' : 'Disliked'}</div>
								</div>
							</div>
						{/if}
					</div>

					<!-- Overview -->
					<div class="mt-8">
						<h2 class="mb-2 text-xl font-semibold">Overview</h2>
						<p class="leading-relaxed text-gray-300">{movie.overview}</p>
					</div>

					<!-- Director info -->
					{#if director}
						<div class="mt-6">
							<h2 class="mb-2 text-xl font-semibold">Director</h2>
							<div class="flex items-center">
								{#if director.profile_path}
									<img
										src={getProfileUrl(director.profile_path, 'w45')}
										alt={director.name}
										class="mr-3 h-12 w-12 rounded-full object-cover"
									/>
								{:else}
									<div
										class="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-700"
									>
										<span class="text-lg font-bold">{director.name.charAt(0)}</span>
									</div>
								{/if}
								<span class="text-lg">{director.name}</span>
							</div>
						</div>
					{/if}

					<!-- Trailer button -->
					{#if trailer}
						<div class="mt-8">
							<a
								href={`https://www.youtube.com/watch?v=${trailer.key}`}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
							>
								<PlayIcon size="20" />
								Watch Trailer
							</a>
						</div>
					{/if}
				</div>
			</div>

			<!-- Cast section -->
			{#if cast.length > 0}
				<div class="mt-16">
					<h2 class="mb-6 text-2xl font-bold">Top Cast</h2>
					<div class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
						{#each cast as person (person.id)}
							<div class="overflow-hidden rounded-lg bg-gray-800 shadow-lg">
								{#if person.profile_path}
									<img
										src={getProfileUrl(person.profile_path)}
										alt={person.name}
										class="h-48 w-full object-cover"
									/>
								{:else}
									<div class="flex h-48 w-full items-center justify-center bg-gray-700">
										<span class="text-3xl font-bold">{person.name.charAt(0)}</span>
									</div>
								{/if}
								<div class="p-4">
									<h3 class="font-bold">{person.name}</h3>
									<p class="text-sm text-gray-400">{person.character}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Back button -->
			<div class="mt-12">
				<a href="/movies" class="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300">
					<ArrowLeftIcon size="16" />
					Back to Movies
				</a>
			</div>
		</div>
	</div>
</div>
