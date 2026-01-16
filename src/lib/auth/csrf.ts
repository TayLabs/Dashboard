import 'server-only';
import { cookies } from 'next/headers';
import { parseCookie } from '@/utils/cookies';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export async function initializeCSRFToken(): Promise<string> {
  const cookieStore = await cookies();

  let csrfToken = cookieStore.get('csrf');

  if (!csrfToken || !csrfToken.value) {
    const response = await fetch(
      `http://${process.env.AUTH_API_URI}/api/v1/auth/csrf`,
      {
        method: 'GET',
      }
    );

    const resBody = await response.json();

    if (response.ok && resBody.success) {
      const cookieHeaders = response.headers.getSetCookie();

      for (const cookieHeader of cookieHeaders) {
        cookieStore.set(parseCookie(cookieHeader));
      }

      cookieStore.set('csrf', resBody.data.csrfToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
      });

      csrfToken = { value: resBody.data.csrfToken } as RequestCookie;
    }
  }

  return csrfToken!.value;
}

export async function getCSRFToken() {
  const cookieStore = await cookies();

  let csrfToken = cookieStore.get('csrf');

  if (!csrfToken) {
    csrfToken = { value: await initializeCSRFToken() } as RequestCookie;
  }

  return csrfToken.value;
}
