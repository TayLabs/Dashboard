'use client';

import { User } from '@/types/User';
import { createContext } from 'react';

export type UserContext = {
  user?: User | null;
};

export const userContext = createContext<UserContext>({
  user: undefined,
});

export function UserProvider({
  children,
  user,
}: Readonly<{ children: React.ReactNode; user?: User | null }>) {
  return (
    <userContext.Provider value={{ user }}>{children}</userContext.Provider>
  );
}
