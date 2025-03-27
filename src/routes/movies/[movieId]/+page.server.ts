import { getMovieDetails } from '$lib/server/tmdb/api';
import { getMovieRating } from '$lib/server/actions/movieRating';
import { error } from '@sveltejs/kit';
import { auth } from '@/server/auth';

export const load = async ({ params, request }) => {
	const { movieId } = params;

	try {
		const movie = await getMovieDetails(movieId);

		// Get user rating if authenticated
		let userRating = null;
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (session) {
			userRating = await getMovieRating(session.user.id, movieId);
		}

		return {
			movie,
			userRating
		};
	} catch (err) {
		console.error('Error fetching movie details:', err);
		throw error(404, 'Movie not found');
	}
};
