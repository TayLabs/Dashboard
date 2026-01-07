'use server';

import { getAccessToken } from '@/lib/auth';
import { FormActionResponse } from './types/FormAction';
import { Service } from './types/interface/Service.interface';
import { UUID } from 'node:crypto';
import { Permission } from './types/interface/Permission';
import { getCSRFToken } from '@/lib/auth/csrf';
import { cookies } from 'next/headers';

export async function getAllServices(): Promise<
  { success: true; services: Service[] } | { success: false; error: string }
> {
  try {
    const results: Service[] = [];

    const { accessToken } = await getAccessToken();
    const responseAuth = await fetch(
      'http://localhost:7313/api/v1/admin/services',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => res.json());
    if (!responseAuth.success) throw new Error('Auth: ' + responseAuth.message);

    const responseKeys = await fetch('http://localhost:2313/api/v1/services', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
    if (!responseKeys.success) throw new Error('Keys: ' + responseKeys.message);
    responseAuth.data.services.map(
      (service: {
        id: UUID;
        name: string;
        isExternal: boolean;
        permissions: {
          id: UUID;
          serviceId: UUID;
          key: string;
          description: string;
        }[];
      }) =>
        results.push({
          authId: service.id,
          isExternal: service.isExternal,
          name: service.name,
          permissions: service.permissions.map(({ id, ...permission }) => ({
            ...permission,
            authId: id,
          })),
        })
    );

    responseKeys.data.services.map(
      (service: {
        id: UUID;
        name: string;
        isExternal: boolean;
        permissions: {
          id: UUID;
          serviceId: UUID;
          key: string;
          description: string;
        }[];
      }) => {
        const i = results.findIndex((val) => val.name === service.name);
        if (i > -1) {
          service.permissions.map((permission) => {
            const j = results[i].permissions.findIndex(
              (perm) => perm.key === permission.key
            );

            if (j > -1) {
              results[i].permissions[j].keysId = permission.id;
            }
          });
          results[i].keysId = service.id;
        }
      }
    );

    return { success: true, services: results };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getService(
  name: string
): Promise<
  { success: true; service: Service } | { success: false; error: string }
> {
  try {
    const { accessToken } = await getAccessToken();
    const responseAuth = await fetch(
      `http://localhost:7313/api/v1/admin/services/${name}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => res.json());
    if (!responseAuth.success) throw new Error('Auth: ' + responseAuth.message);

    const responseKeys = await fetch(
      `http://localhost:2313/api/v1/services/${name}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => res.json());
    if (!responseKeys.success) throw new Error('Keys: ' + responseKeys.message);

    const result = {
      authId: responseAuth.data.service.id,
      keysId: undefined,
      isExternal: responseAuth.data.service.isExternal,
      name: responseAuth.data.service.name,
      permissions: responseAuth.data.service.permissions.map(
        (permission: { key: string; description: string }) => ({
          ...permission,
          scopes: ['user'],
        })
      ),
    };

    responseKeys.data.service.permissions.map(
      (permission: { id: UUID; key: string; description: string }) => {
        const j = result.permissions.findIndex(
          (perm: Permission) => perm.key === permission.key
        );

        if (j > -1) {
          result.permissions[j].scopes.push('api-key');
        } else {
          result.permissions.push({
            ...permission,
            scopes: ['api-key'],
          });
        }
      }
    );
    result.keysId = responseKeys.data.service.id;

    return { success: true, service: result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function registerService(data: {
  service: string;
  permissions: {
    key: string;
    description: string;
    scopes: ('api-key' | 'user')[];
  }[];
}): Promise<FormActionResponse> {
  try {
    const cookieStore = await cookies();

    const csrf = await getCSRFToken();

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
    const { accessToken } = await getAccessToken();
    const responseAuth = await fetch(
      `http://localhost:7313/api/v1/admin/services/register`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookieHeader,
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf,
        },
        body: JSON.stringify({
          ...data,
          permissions: data.permissions.filter((permission) =>
            permission.scopes.includes('user')
          ),
        }),
      }
    ).then((res) => res.json());
    if (!responseAuth.success) throw new Error(responseAuth.message);

    const responseKeys = await fetch(
      `http://localhost:2313/api/v1/services/register`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookieHeader,
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf,
        },
        body: JSON.stringify({
          ...data,
          permissions: data.permissions.filter((permission) =>
            permission.scopes.includes('api-key')
          ),
        }),
      }
    ).then((res) => res.json());
    if (!responseKeys.success) throw new Error(responseKeys.message);

    return { success: true };
  } catch (error) {
    if ((error as Error).message === 'A service with that name already exist') {
      return {
        success: false,
        error: (error as Error).message,
        errors: {
          service: (error as Error).message,
        },
      };
    } else {
      return { success: false, error: (error as Error).message };
    }
  }
}

export async function updateService(
  name: string,
  data: {
    service: string;
    permissions: {
      key: string;
      description: string;
      scopes: ('api-key' | 'user')[];
    }[];
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
    const responseAuth = await fetch(
      `http://localhost:7313/api/v1/admin/services/${name}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookieHeader,
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf,
        },
        body: JSON.stringify({
          ...data,
          permissions: data.permissions.filter((permission) =>
            permission.scopes.includes('user')
          ),
        }),
      }
    ).then((res) => res.json());
    if (!responseAuth.success) throw new Error(responseAuth.message);

    const responseKeys = await fetch(
      `http://localhost:2313/api/v1/services/${name}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          permissions: data.permissions.filter((permission) =>
            permission.scopes.includes('api-key')
          ),
        }),
      }
    ).then((res) => res.json());
    if (!responseKeys.success) throw new Error(responseKeys.message);

    return { success: true };
  } catch (error) {
    if ((error as Error).message === 'A service with that name already exist') {
      return {
        success: false,
        error: (error as Error).message,
        errors: {
          service: (error as Error).message,
        },
      };
    } else {
      return { success: false, error: (error as Error).message };
    }
  }
}

export async function removeService(name: string) {
  try {
    const cookieStore = await cookies();

    const csrf = await getCSRFToken();

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
    const { accessToken } = await getAccessToken();
    const responseAuth = await fetch(
      `http://localhost:7313/api/v1/admin/services/${name}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookieHeader,
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf,
        },
      }
    ).then((res) => res.json());
    if (!responseAuth.success) throw new Error(responseAuth.message);

    const responseKeys = await fetch(
      `http://localhost:2313/api/v1/services/${name}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => res.json());
    if (!responseKeys.success) throw new Error(responseKeys.message);

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
