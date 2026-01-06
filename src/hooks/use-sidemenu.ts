import { sideMenuContext } from '@/contexts/SideMenuContext';
import { useContext } from 'react';

export function useSideMenu() {
  return useContext(sideMenuContext);
}
