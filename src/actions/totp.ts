'use server';

import { getAccessToken, refreshSession } from '@/lib/auth';
import { FormActionResponse } from './types/FormAction';
import { getCSRFToken } from '@/lib/auth/csrf';
import { cookies } from 'next/headers';
import { parseCookie } from '@/utils/cookies';
import { UUID } from 'node:crypto';
import { TOTPToken } from './types/interface/TOTPToken.interface';

export async function getAllTOTP(): Promise<
  FormActionResponse<{ totpTokens: TOTPToken[] }>
> {
  try {
    const { accessToken } = await getAccessToken();
    const response = await fetch(
      'http://localhost:7313/api/v1/account/security/totp/',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const resBody = await response.json();

    if (!resBody.success) {
      throw new Error(resBody.message);
    }

    return { success: true, totpTokens: resBody.data.totpTokens };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

export async function validateTOTP({
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
      'http://localhost:7313/api/v1/auth/totp/validate',
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

    const resBody = await response.json();

    if (!resBody?.success) {
      throw new Error(resBody.message);
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
      };
    }
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

export async function createTOTP(): Promise<
  FormActionResponse<{
    totpTokenRecord: TOTPToken;
    qrCode: string;
  }>
> {
  try {
    const cookieStore = await cookies();

    const csrf = await getCSRFToken();

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
    const { accessToken } = await getAccessToken();
    const response = await fetch(
      `http://localhost:7313/api/v1/account/security/totp/create`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookieHeader,
          'X-CSRF-Token': csrf,
        },
      }
    );

    const resBody = await response.json();

    if (!resBody?.success) {
      throw new Error(resBody.message);
    }

    return {
      success: true,
      totpTokenRecord: resBody.data.totpTokenRecord,
      qrCode: resBody.data.qrCode,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

export async function verifyTOTP(
  totpTokenId: UUID,
  {
    code,
  }: {
    code: string;
  }
): Promise<FormActionResponse> {
  try {
    const cookieStore = await cookies();

    const csrf = await getCSRFToken();

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');

    const { accessToken } = await getAccessToken();
    const response = await fetch(
      `http://localhost:7313/api/v1/account/security/totp/verify/${totpTokenId}`,
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

    const resBody = await response.json();

    if (!resBody?.success) {
      throw new Error(resBody.message);
    }

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

export async function removeTOTP(id: UUID): Promise<FormActionResponse> {
  try {
    const cookieStore = await cookies();

    const csrf = await getCSRFToken();

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
    const { accessToken } = await getAccessToken();
    const response = await fetch(
      `http://localhost:7313/api/v1/account/security/totp/remove/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookieHeader,
          'X-CSRF-Token': csrf,
        },
      }
    );

    const resBody = await response.json();

    if (!resBody?.success) {
      throw new Error(resBody.message);
    }

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
