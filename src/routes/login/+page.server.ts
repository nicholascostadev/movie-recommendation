import { auth } from '@/server/auth.js';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginFormSchema } from './schema';

export async function load({ request }) {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (session) {
		redirect(302, '/problems');
	}

	const form = await superValidate(zod(loginFormSchema));
	return {
		session,
		form
	};
}
