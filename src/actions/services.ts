'use server';

import { FormActionResponse } from './types/FormAction';

export async function registerService(data: {
  name: string;
  permissions: string[];
}): Promise<FormActionResponse> {
  console.log('hitting registerService', data);
  return { success: true };
}
