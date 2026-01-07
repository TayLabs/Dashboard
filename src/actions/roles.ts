'use server';

import { getAccessToken } from '@/lib/auth';
import type { Role } from './types/interface/Role';
import { UUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { getCSRFToken } from '@/lib/auth/csrf';
import { FormActionResponse } from './types/FormAction';

export async function getAllRoles(): Promise<
  { success: true; roles: Role[] } | { success: false; error: string }
> {
  try {
    const { accessToken } = await getAccessToken();
    const responseAuth = await fetch(
      'http://localhost:7313/api/v1/admin/roles',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => res.json());
    if (!responseAuth.success) throw new Error(responseAuth.message);

    return { success: true, roles: responseAuth.data.roles };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getRole(
  id: UUID
): Promise<{ success: true; role: Role } | { success: false; error: string }> {
  try {
    const { accessToken } = await getAccessToken();
    const responseAuth = await fetch(
      `http://localhost:7313/api/v1/admin/roles/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => res.json());
    if (!responseAuth.success) throw new Error(responseAuth.message);

    return { success: true, role: responseAuth.data.role };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function addRole(
  data: Omit<Role, 'id' | 'permissions'> & { permissions: UUID[] }
): Promise<FormActionResponse<{ role: Role }>> {
  try {
    const cookieStore = await cookies();

    const csrf = await getCSRFToken();

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
    const { accessToken } = await getAccessToken();
    const responseAuth = await fetch(
      `http://localhost:7313/api/v1/admin/roles`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookieHeader,
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf,
        },
        body: JSON.stringify(data),
      }
    ).then((res) => res.json());
    if (!responseAuth.success) throw new Error(responseAuth.message);

    return { success: true, role: responseAuth.data.role };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function updateRole(
  id: UUID,
  data: Omit<Role, 'id' | 'permissions'> & { permissions: UUID[] }
): Promise<FormActionResponse<{ role: Role }>> {
  try {
    const cookieStore = await cookies();

    const csrf = await getCSRFToken();

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
    const { accessToken } = await getAccessToken();
    const responseAuth = await fetch(
      `http://localhost:7313/api/v1/admin/roles/${id}`,
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
    if (!responseAuth.success) throw new Error(responseAuth.message);

    return { success: true, role: responseAuth.data.role };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function removeRole(
  id: UUID
): Promise<{ success: true; role: Role } | { success: false; error: string }> {
  try {
    const cookieStore = await cookies();

    const csrf = await getCSRFToken();

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
    const { accessToken } = await getAccessToken();
    const responseAuth = await fetch(
      `http://localhost:7313/api/v1/admin/roles/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookieHeader,
          'X-CSRF-Token': csrf,
        },
      }
    ).then((res) => res.json());
    if (!responseAuth.success) throw new Error(responseAuth.message);

    return { success: true, role: responseAuth.data.role };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
