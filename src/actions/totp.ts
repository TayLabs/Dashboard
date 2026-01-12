'use server';

import { getAccessToken } from '@/lib/auth';
import { FormActionResponse } from './types/FormAction';
import { getCSRFToken } from '@/lib/auth/csrf';
import { cookies } from 'next/headers';

export async function verifyTOTP({
  code,
}: {
  code: string;
}): Promise<FormActionResponse> {
  try {
    const cookieStore = await cookies();

    const csrf = await getCSRFToken();

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');

    const { accessToken } = await getAccessToken();
    const response = await fetch(
      'http://localhost:7313/api/v1/auth/two-factor/verify',
      {
        method: 'POST',
        headers: {
          Cookie: cookieHeader,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'X-CSRF-Token': csrf,
        },
        body: JSON.stringify({
          code,
        }),
      }
    );

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
