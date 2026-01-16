'use server';

import { cookies } from 'next/headers';
import { FormActionResponse } from './types/FormAction';
import { getAccessToken } from '@/lib/auth';
import { getCSRFToken } from '@/lib/auth/csrf';

export async function requestReset({
  email,
}: {
  email: string;
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
      `http://${process.env.AUTH_API_URI}/api/v1/auth/password/reset/request`,
      {
        method: 'POST',
        headers: {
          Cookie: cookieHeader,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'X-CSRF-Token': csrf,
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    const resBody = await response.json();

    if (!resBody.success) {
      throw new Error(resBody.message);
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

export async function resetPassword({
  token,
  password,
  passwordConfirm,
}: {
  token: string;
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
      `http://${process.env.AUTH_API_URI}/api/v1/auth/password/reset?t=${token}`,
      {
        method: 'PATCH',
        headers: {
          Cookie: cookieHeader,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'X-CSRF-Token': csrf,
        },
        body: JSON.stringify({
          password,
          passwordConfirm,
        }),
      }
    );

    const resBody = await response.json();

    if (!resBody.success) {
      throw new Error(resBody.message);
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
