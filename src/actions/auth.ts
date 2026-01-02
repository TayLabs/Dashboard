'use server';

import { parseCookie } from '@/utils/cookies';
import { type FormActionResponse } from './types/FormAction';
import { getCSRFToken } from '@/lib/auth/csrf';
import { cookies } from 'next/headers';

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
    const cookieStore = await cookies();

    const csrf = await getCSRFToken();

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
    const response = await fetch('http://localhost:7313/api/v1/auth/login', {
      method: 'POST',
      headers: {
        Cookie: cookieHeader,
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrf,
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
        error: resBody.message || 'An unknown error occurred, please try again',
      };
    } else {
      // Set cookies for login action
      const cookieHeaders = response.headers.getSetCookie();

      for (const cookieHeader of cookieHeaders) {
        const cookie = parseCookie(cookieHeader);

        cookieStore.set(cookie);
      }

      return {
        success: true,
      };
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    } else {
      return {
        success: false,
        error: 'An unknown error occured, please try again',
      };
    }
  }
}
