import { auth } from '@/server/auth';
import { redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { registerFormSchema } from './schema.js';

export async function load({ request }) {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (session) {
		redirect(302, '/problems');
	}

	const form = await superValidate(zod(registerFormSchema));

	return {
		session,
		form
	};
}
