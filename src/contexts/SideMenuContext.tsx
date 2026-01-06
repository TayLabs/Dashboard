'use client';

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useState,
} from 'react';

type SideMenuContext = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const sideMenuContext = createContext<SideMenuContext>({
  isOpen: false,
  setIsOpen: () => {},
});

export function SideMenuProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <sideMenuContext.Provider
      value={{
        isOpen,
        setIsOpen,
      }}>
      {children}
    </sideMenuContext.Provider>
  );
}
