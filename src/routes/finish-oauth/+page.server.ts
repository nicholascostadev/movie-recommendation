import { auth } from '@/server/auth';
import { redirect } from '@sveltejs/kit';

export async function load({ request }) {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		redirect(302, '/login');
	}

	if (session.user.username) {
		redirect(302, '/problems');
	}

	return;
}
