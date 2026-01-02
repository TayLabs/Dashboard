import { cookies } from 'next/headers';

export async function initializeCSRFToken() {
	const cookieStore = await cookies();

	const csrfToken = cookieStore.get('csrf');

	if (!csrfToken) {
		const response = await fetch('http://localhost:7313/api/v1/auth/csrf', {
			method: 'GET',
		});

		const resBody = await response.json();

		if (response.ok && resBody.success) {
			cookieStore.set();
		}
	}
}
