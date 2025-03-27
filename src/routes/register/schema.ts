import { z } from 'zod';

export const registerFormSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
	name: z
		.string()
		.min(5, 'Name must be at least 5 characters long')
		.max(60, 'Name must be less than 60 characters long'),
	username: z
		.string()
		.min(5, 'Username must be at least 5 characters long')
		.max(20, 'Username must be less than 20 characters long')
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
