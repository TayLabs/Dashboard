import { userContext } from '@/contexts/UserContext';
import { useContext } from 'react';

export function useUser() {
  const context = useContext(userContext);

  return context;
}
