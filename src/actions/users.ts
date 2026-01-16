'use server';

import { getAccessToken } from '@/lib/auth';
import { getCSRFToken } from '@/lib/auth/csrf';
import type { User } from '@/types/User';
import { cookies } from 'next/headers';
import type { UUID } from 'node:crypto';
import { Role } from './types/interface/Role';
import { FormActionResponse } from './types/FormAction';

export async function getAllUsers(): Promise<
  { success: true; users: User[] } | { success: false; error: string }
> {
  try {
    const { accessToken } = await getAccessToken();
    const response = await fetch(
      `http://${process.env.AUTH_API_URI}/api/v1/admin/users`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => res.json());
    if (!response.success) throw new Error(response.message);

    return {
      success: true,
      users: response.data.users,
    };
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

export async function getUserWithRoles(
  userId: UUID
): Promise<
  | { success: true; user: User & { roles: Role[] } }
  | { success: false; error: string }
> {
  try {
    const { accessToken } = await getAccessToken();
    const response = await fetch(
      `http://${process.env.AUTH_API_URI}/api/v1/admin/users/${userId}/roles`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => res.json());
    if (!response.success) throw new Error(response.message);

    return {
      success: true,
      user: response.data.user,
    };
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

export async function forcePasswordReset(
  userId: UUID
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const cookieStore = await cookies();

    const csrf = await getCSRFToken();

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
    const { accessToken } = await getAccessToken();
    const response = await fetch(
      `http://${process.env.AUTH_API_URI}/api/v1/admin/users/${userId}/force-password-reset`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookieHeader,
          'X-CSRF-Token': csrf,
        },
      }
    ).then((res) => res.json());
    if (!response.success) throw new Error(response.message);

    return {
      success: true,
    };
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

export async function updateRoles(
  userId: UUID,
  roleIds: UUID[]
): Promise<FormActionResponse<{ roles: Role[] }>> {
  try {
    const cookieStore = await cookies();

    const csrf = await getCSRFToken();

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
    const { accessToken } = await getAccessToken();
    const response = await fetch(
      `http://${process.env.AUTH_API_URI}/api/v1/admin/users/${userId}/roles`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookieHeader,
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf,
        },
        body: JSON.stringify({ roles: roleIds }),
      }
    ).then((res) => res.json());
    if (!response.success) throw new Error(response.message);

    return {
      success: true,
      roles: response.data.roles,
    };
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

export async function toggleTwoFactor(
  toggle: boolean
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
      `http://localhost:7313/api/v1/account/security/two-factor/${
        toggle ? 'on' : 'off'
      }`,
      {
        method: 'PATCH',
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

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
