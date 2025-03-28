import type { Category, Movie, MovieDetails } from '@/tmdb';
import { TMDB_BASE_URL, tmdbFetch } from '../tmdbFetch';

async function fetchFromTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
	const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

	for (const [key, value] of Object.entries(params)) {
		url.searchParams.append(key, value);
	}

	const response = await tmdbFetch(url.toString());

	if (response.error) {
		throw new Error(`TMDB API error: ${response.error.status} ${response.error.message}`);
	}

	return response.data as T;
}

export async function getMoviesByCategory(): Promise<Category[]> {
	// Define the categories to fetch
	const categoriesToFetch = [
		{ id: 'popular', name: 'Popular', endpoint: '/movie/popular' },
		{ id: 'top_rated', name: 'Top Rated', endpoint: '/movie/top_rated' },
		{ id: 'now_playing', name: 'Now Playing', endpoint: '/movie/now_playing' },
		{ id: 'upcoming', name: 'Upcoming', endpoint: '/movie/upcoming' }
	];

	// Fetch all categories in parallel
	const results = await Promise.all(
		categoriesToFetch.map((category) =>
			fetchFromTMDB<{ results: Movie[] }>(category.endpoint, { page: '1' })
		)
	);

	// Create categories array with the fetched results
	const categories: Category[] = results.map((result, index) => ({
		id: categoriesToFetch[index].id,
		name: categoriesToFetch[index].name,
		movies: result.results.slice(0, 20)
	}));

	// Generate "Recommended" category with random movies from all categories
	const allMovies = results.flatMap((result) => result.results);
	const uniqueMovies = Array.from(new Map(allMovies.map((movie) => [movie.id, movie])).values());
	const shuffledMovies = uniqueMovies.sort(() => Math.random() - 0.5);

	categories.unshift({
		id: 'recommended',
		name: 'Recommended',
		movies: shuffledMovies.slice(0, 20)
	});

	return categories;
}

export async function getMovieDetails(id: string): Promise<MovieDetails> {
	return fetchFromTMDB<MovieDetails>(`/movie/${id}`, {
		append_to_response: 'credits,videos'
	});
}
