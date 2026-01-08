'use server';

import { getAccessToken } from '@/lib/auth';
import type { Key } from './types/interface/Key';
import { UUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { getCSRFToken } from '@/lib/auth/csrf';
import { FormActionResponse } from './types/FormAction';

export async function getAllKeys(): Promise<
  { success: true; keys: Key[] } | { success: false; error: string }
> {
  try {
    const { accessToken } = await getAccessToken();
    const responseKeys = await fetch(`http://localhost:2313/api/v1/keys`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
    if (!responseKeys.success) throw new Error(responseKeys.message);

    return { success: true, keys: responseKeys.data.keys };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getKey(
  id: UUID
): Promise<{ success: true; key: Key } | { success: false; error: string }> {
  try {
    const { accessToken } = await getAccessToken();
    const responseKeys = await fetch(
      `http://localhost:2313/api/v1/keys/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => res.json());
    if (!responseKeys.success) throw new Error(responseKeys.message);

    return { success: true, key: responseKeys.data.key };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function addKey(
  data: Pick<Key, 'name'> & {
    permissions: string[];
  }
): Promise<FormActionResponse<{ key: Key; apiKey: string }>> {
  try {
    const cookieStore = await cookies();

    const csrf = await getCSRFToken();

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
    const { accessToken } = await getAccessToken();
    const responseKeys = await fetch(`http://localhost:2313/api/v1/keys`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Cookie: cookieHeader,
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrf,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());

    if (!responseKeys.success) throw new Error(responseKeys.message);

    return {
      success: true,
      key: responseKeys.data.key,
      apiKey: responseKeys.data.apiKey,
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function updateKey(
  id: UUID,
  data: Pick<Key, 'name'> & {
    permissions: string[];
  }
): Promise<FormActionResponse<{ key: Key; apiKey: null }>> {
  try {
    const cookieStore = await cookies();

    const csrf = await getCSRFToken();

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
    const { accessToken } = await getAccessToken();
    const responseKeys = await fetch(
      `http://localhost:2313/api/v1/keys/${id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookieHeader,
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf,
        },
        body: JSON.stringify(data),
      }
    ).then((res) => res.json());
    if (!responseKeys.success) throw new Error(responseKeys.message);

    return { success: true, key: responseKeys.data.key, apiKey: null };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function removeKey(
  id: UUID
): Promise<{ success: true; key: Key } | { success: false; error: string }> {
  try {
    const cookieStore = await cookies();

    const csrf = await getCSRFToken();

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
    const { accessToken } = await getAccessToken();
    const responseKeys = await fetch(
      `http://localhost:2313/api/v1/keys/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookieHeader,
          'X-CSRF-Token': csrf,
        },
      }
    ).then((res) => res.json());
    if (!responseKeys.success) throw new Error(responseKeys.message);

    return { success: true, key: responseKeys.data.key };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
