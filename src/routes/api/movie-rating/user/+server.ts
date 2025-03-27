import { json } from '@sveltejs/kit';
import { getUserMovieRatings } from '$lib/server/actions/movieRating';
import { auth } from '@/server/auth';

export const GET = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const ratings = await getUserMovieRatings(session.user.id);
		return json({ ratings });
	} catch (error) {
		console.error('Error fetching user ratings:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch ratings' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
