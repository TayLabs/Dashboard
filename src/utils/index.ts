import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function isExecutedFromServerComponent(): Promise<boolean> {
  try {
    cookieStore.set('_', '');
  } catch {
    return true;
  }

  return false;
}
