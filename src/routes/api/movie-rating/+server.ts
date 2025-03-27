import { json } from '@sveltejs/kit';
import { rateMovie, deleteMovieRating } from '$lib/server/actions/movieRating';
import { auth } from '@/server/auth';

export const POST = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const { movieId, liked } = await request.json();

	if (typeof movieId !== 'string' || typeof liked !== 'boolean') {
		return new Response(JSON.stringify({ error: 'Invalid input' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const result = await rateMovie(session.user.id, { movieId, liked });
		return json({ success: true, rating: result[0] });
	} catch (error) {
		console.error('Error rating movie:', error);
		return new Response(JSON.stringify({ error: 'Failed to rate movie' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

export const DELETE = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const { movieId } = await request.json();

	if (typeof movieId !== 'string') {
		return new Response(JSON.stringify({ error: 'Invalid input' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		await deleteMovieRating(session.user.id, movieId);
		return json({ success: true });
	} catch (error) {
		console.error('Error deleting movie rating:', error);
		return new Response(JSON.stringify({ error: 'Failed to delete movie rating' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
