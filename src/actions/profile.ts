'use server';

import { cookies } from 'next/headers';

export async function getProfile() {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');
  const accessToken = cookieStore.get('_access_t')?.value;
  const response = await fetch('http://localhost:7313/api/v1/account/profile', {
    method: 'GET',
    headers: {
      Cookie: cookieHeader,
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
