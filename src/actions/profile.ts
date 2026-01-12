'use server';

import { getAccessToken } from '@/lib/auth';
import { User } from '@/types/User';

export async function getProfile(): Promise<User | null> {
  const { accessToken } = await getAccessToken();

  const response = await fetch('http://localhost:7313/api/v1/account/profile', {
    method: 'GET',
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    } as HeadersInit,
  });

  const resBody = await response.json();

  if (!resBody.success) {
    return null;
  } else {
    return resBody.data.profile;
  }
}
