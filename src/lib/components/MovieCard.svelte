<script lang="ts">
	import { authClient } from '@/auth-client';
	import { rateMovie, removeRating } from '@/stores/ratings.svelte';
	import { getPosterUrl, type Movie } from '@/tmdb';
	import { ThumbsDownIcon, ThumbsUpIcon } from '@lucide/svelte';

	let {
		movie,
		isLiked
	}: {
		movie: Movie;
		isLiked: boolean | undefined;
	} = $props();

	const posterUrl = getPosterUrl(movie.poster_path) || '/placeholder-poster.jpg';
	const session = authClient.useSession();
	const isAuthenticated = $derived(!!$session.data?.user);

	function handleLike(e: MouseEvent) {
		e.stopPropagation();
		if (isLiked) {
			removeRating(movie.id.toString());
			isLiked = undefined;
		} else {
			rateMovie(movie.id.toString(), true);
			isLiked = true;
		}
	}

	function handleDislike(e: MouseEvent) {
		e.stopPropagation();
		if (isLiked === false) {
			removeRating(movie.id.toString());
			isLiked = undefined;
		} else {
			rateMovie(movie.id.toString(), false);
			isLiked = false;
		}
	}
</script>

<div
	class="movie-card group relative overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-transform hover:scale-105"
>
	<a href={`/movies/${movie.id}`} class="block">
		<img
			src={posterUrl}
			alt={`${movie.title} poster`}
			class="h-72 w-full object-cover"
			loading="lazy"
		/>
		<div
			class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
		></div>
		<div
			class="absolute bottom-0 left-0 right-0 translate-y-2 transform p-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
		>
			<h3 class="line-clamp-2 text-lg font-bold text-white">{movie.title}</h3>
			<div class="mt-1 flex items-center">
				<span class="text-sm text-yellow-400">{movie.vote_average.toFixed(1)}</span>
				<span class="mx-2 text-gray-400">•</span>
				<span class="text-sm text-gray-300">{new Date(movie.release_date).getFullYear()}</span>
			</div>
		</div>
	</a>

	{#if isAuthenticated}
		<div class="absolute right-2 top-2 flex gap-1">
			<button
				onclick={handleLike}
				class="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 transition-colors hover:bg-black/70 {isLiked ===
				true
					? 'text-green-500'
					: 'text-white'}"
				aria-label="Like movie"
			>
				<ThumbsUpIcon fill={isLiked ? 'currentColor' : 'none'} size="16" />
			</button>
			<button
				onclick={handleDislike}
				class="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 transition-colors hover:bg-black/70 {isLiked ===
				false
					? 'text-red-500'
					: 'text-white'}"
				aria-label="Dislike movie"
			>
				<ThumbsDownIcon fill={isLiked === false ? 'currentColor' : 'none'} size="16" />
			</button>
		</div>
	{/if}
</div>
