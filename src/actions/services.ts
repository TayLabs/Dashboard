'use server';

import { getAccessToken } from '@/lib/auth';
import { FormActionResponse } from './types/FormAction';
import { Service } from './types/interface/Service.interface';
import { UUID } from 'node:crypto';

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
					permissions: service.permissions,
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

export async function getServices(): Promise<
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
					permissions: service.permissions,
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

export async function registerService(data: {
	name: string;
	permissions: string[];
}): Promise<FormActionResponse> {
	console.log('hitting registerService', data);
	return { success: true };
}
