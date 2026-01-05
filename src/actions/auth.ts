'use server';

import { parseCookie } from '@/utils/cookies';
import { type FormActionResponse } from './types/FormAction';
import { getCSRFToken } from '@/lib/auth/csrf';
import { cookies } from 'next/headers';
import { getAccessToken, PendingActionType } from '@/lib/auth';

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<FormActionResponse<{ pending: PendingActionType }>> {
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
      const token = resBody.data.accessToken;
      cookieStore.set('_access_t', token, {
        // expires: ... // Session cookie, refreshes on each new visit/session
        httpOnly: true,
        path: '/',
        domain: 'localhost',
        sameSite: 'lax',
      });

      // Set cookies for login action
      const cookieHeaders = response.headers.getSetCookie();

      for (const cookieHeader of cookieHeaders) {
        const cookie = parseCookie(cookieHeader);

        cookieStore.set(cookie);
      }

      return {
        success: true,
        pending: resBody.data.pending as PendingActionType,
      };
    }
  } catch (error) {
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

export async function resetPassword({
  currentPassword,
  password,
  passwordConfirm,
}: {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}): Promise<FormActionResponse> {
  try {
    const cookieStore = await cookies();

    const { accessToken } = await getAccessToken();
    const csrf = await getCSRFToken();

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
    const response = await fetch(
      'http://localhost:7313/api/v1/auth/password/change',
      {
        method: 'PATCH',
        headers: {
          Cookie: cookieHeader,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'X-CSRF-Token': csrf,
        },
        body: JSON.stringify({
          currentPassword,
          password,
          passwordConfirm,
        }),
      }
    );

    const resBody = await response.json();

    if (!resBody.success) {
      return {
        success: false,
        error: resBody.message || 'An unknown error occurred, please try again',
      };
    } else {
      cookieStore.delete('_access_t');
      const selectedSessionId = cookieStore.get('_selected_s')?.value;
      cookieStore.delete('_selected_s');
      if (selectedSessionId) cookieStore.delete(`_s_${selectedSessionId}`);

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
