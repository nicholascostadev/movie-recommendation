import { TMDB_API_KEY } from '$env/static/private';
import type { Category, Movie, MovieDetails } from '@/tmdb';

const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchFromTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
	const url = new URL(`${BASE_URL}${endpoint}`);

	for (const [key, value] of Object.entries(params)) {
		url.searchParams.append(key, value);
	}

	const response = await fetch(url.toString(), {
		headers: {
			Authorization: `Bearer ${TMDB_API_KEY}`
		}
	});

	if (!response.ok) {
		throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
	}

	return response.json() as Promise<T>;
}

export async function getMoviesByCategory(): Promise<Category[]> {
	const categories: Category[] = [];

	// Fetch popular movies
	const popularMovies = await fetchFromTMDB<{ results: Movie[] }>('/movie/popular', { page: '1' });
	categories.push({ id: 'popular', name: 'Popular', movies: popularMovies.results.slice(0, 20) });

	// Fetch top rated movies
	const topRatedMovies = await fetchFromTMDB<{ results: Movie[] }>('/movie/top_rated', {
		page: '1'
	});
	categories.push({
		id: 'top_rated',
		name: 'Top Rated',
		movies: topRatedMovies.results.slice(0, 20)
	});

	// Fetch now playing movies
	const nowPlayingMovies = await fetchFromTMDB<{ results: Movie[] }>('/movie/now_playing', {
		page: '1'
	});
	categories.push({
		id: 'now_playing',
		name: 'Now Playing',
		movies: nowPlayingMovies.results.slice(0, 20)
	});

	// Fetch upcoming movies
	const upcomingMovies = await fetchFromTMDB<{ results: Movie[] }>('/movie/upcoming', {
		page: '1'
	});
	categories.push({
		id: 'upcoming',
		name: 'Upcoming',
		movies: upcomingMovies.results.slice(0, 20)
	});

	// Generate "Recommended" category with random movies from all categories
	const allMovies = [
		...popularMovies.results,
		...topRatedMovies.results,
		...nowPlayingMovies.results,
		...upcomingMovies.results
	];
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
