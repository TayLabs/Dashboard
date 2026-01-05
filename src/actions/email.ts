'use server';

import { getAccessToken } from '@/lib/auth';
import { getCSRFToken } from '@/lib/auth/csrf';
import { cookies } from 'next/headers';

export async function requestEmailVerification() {
  try {
    const cookieStore = await cookies();

    const { accessToken } = await getAccessToken();
    const csrf = await getCSRFToken();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
    const response = await fetch(
      'http://localhost:7313/api/v1/auth/email/verify/request',
      {
        method: 'POST',
        headers: {
          Cookie: cookieHeader,
          Authorization: `Bearer ${accessToken}`,
          'X-CSRF-Token': csrf,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          linkBaseUrl: 'http://localhost:7919/auth/verify-email/verify',
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
      return {
        success: true,
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

export async function verifyEmail(token: string) {
  try {
    const cookieStore = await cookies();

    const queryString = new URLSearchParams({ t: token }).toString();

    const csrf = await getCSRFToken();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
    const response = await fetch(
      `http://localhost:7313/api/v1/auth/email/verify?${queryString}`,
      {
        method: 'POST',
        headers: {
          Cookie: cookieHeader,
          'X-CSRF-Token': csrf,
        },
      }
    );

    const resBody = await response.json();

    if (!resBody.success) {
      return {
        success: false,
        error: resBody.message || 'An unknown error occurred, please try again',
      };
    } else {
      return {
        success: true,
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
