import { getUserMovieRatings } from '$lib/server/actions/movieRating';
import { auth } from '@/server/auth';
import { getMoviesByCategory } from '@/server/tmdb/api';
import type { MovieRating } from '@/types';

export const load = async ({ request }) => {
	const categories = await getMoviesByCategory();

	// Get user ratings if the user is authenticated
	const session = await auth.api.getSession({
		headers: request.headers
	});
	let userRatings: MovieRating[] = [];

	if (session) {
		userRatings = await getUserMovieRatings(session.user.id);
	}

	return {
		categories,
		userRatings
	};
};
