'use server';

import { getAccessToken } from '@/lib/auth';
import { getCSRFToken } from '@/lib/auth/csrf';
import { Profile, User } from '@/types/User';
import { cookies } from 'next/headers';
import { FormActionResponse } from './types/FormAction';

export async function getProfile(): Promise<User | null> {
  try {
    const { accessToken } = await getAccessToken();

    const response = await fetch(
      `http://${process.env.AUTH_API_URI}/api/v1/account/profile`,
      {
        method: 'GET',
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        } as HeadersInit,
      }
    );

    const resBody = await response.json();

    if (!resBody.success) {
      return null;
    } else {
      return resBody.data.profile;
    }
  } catch {
    return null;
  }
}

export async function updateProfile(
  data: Omit<Profile, 'id' | 'updatedAt' | 'avatarUrl'>
): Promise<FormActionResponse<{ user: User }>> {
  try {
    const { accessToken } = await getAccessToken();
    const cookieStore = await cookies();

    const csrf = await getCSRFToken();

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
    const response = await fetch(
      `http://${process.env.AUTH_API_URI}/api/v1/account/profile`,
      {
        method: 'PATCH',
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
          Cookie: cookieHeader,
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf,
        } as HeadersInit,
        body: JSON.stringify({
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName,
          bio: data.bio,
        }),
      }
    );

    const resBody = await response.json();

    if (!resBody.success) {
      throw new Error(resBody.message);
    } else {
      return { success: true, user: resBody.data.profile };
    }
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
