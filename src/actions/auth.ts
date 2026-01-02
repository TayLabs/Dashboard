'use server';

import { parseCookie } from '@/utils/cookies';
import { type FormActionResponse } from './types/FormAction';

// export async function refresh() {
// 	const cookieStore = await cookies();
// 	// TODO: Implement refresh logic

// 	cookieStore.set('TestCookieFromServerComponent', Date.now().toString());

// 	return { accessToken: '' };
// }

export async function login({
	email,
	password,
}: {
	email: string;
	password: string;
}): Promise<FormActionResponse> {
	try {
		const response = await fetch('http://localhost:7313/api/v1/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		});

		const resBody = await response.json();

		if (!resBody.success) {
			return {
				success: false,
			};
		} else {
			// Set cookies for login action
			const cookieHeaders = response.headers.getSetCookie();
			for (const cookieHeader of cookieHeaders) {
				const cookie = parseCookie(cookieHeader);

				cookieStore.set(cookie as CookieInit);
			}

			return {
				success: true,
			};
		}
	} catch (error) {
		console.log(error);
		return {
			success: false,
			error: 'An unhandled error occured, please try again',
		};
	}
}
