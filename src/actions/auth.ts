'use server';

import { cookies } from 'next/headers';

export async function refresh() {
	const cookieStore = await cookies();
	// TODO: Implement refresh logic

	cookieStore.set('TestCookieFromServerComponent', Date.now().toString());

	return { accessToken: '' };
}
