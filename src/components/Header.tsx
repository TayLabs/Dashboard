'use client';

import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWindowScrollPosition } from '@/hooks/use-scroll-position';
import { useSideMenu } from '@/hooks/use-sidemenu';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/utils';
import { MenuIcon, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const headerHeightClassName = 'h-12 md:h-18';

const subDirectories = {
  '/services': 'Auth+Keys',
  '/roles': 'Auth',
  '/keys': 'Keys',
  '/users': 'Auth',
  '/account': 'Account',
} as Record<string, string>;

export default function Header() {
  const pathname = usePathname();
  const subDirectory =
    subDirectories[
      Object.keys(subDirectories)
        .filter((key) => pathname.startsWith(key))
        .reduce((acc, curr) => (acc.length > curr.length ? acc : curr), '') // Find the most specific matching menu item (longest one is most specific)
    ];

  const { user } = useUser();
  const scrollPos = useWindowScrollPosition();
  const { setIsOpen } = useSideMenu();
  const isMobile = useIsMobile();

  return (
    <div className={cn('col-span-2', headerHeightClassName)}>
      <header
        className={cn(
          'w-full px-4 md:px-8 flex items-center justify-between fixed top-0 inset-x-0 bg-background/90 backdrop-blur-sm transition-shadow duration-300 z-10',
          headerHeightClassName,
          {
            'shadow-xs': scrollPos.y > 10,
          }
        )}>
        <h1 className="text-xl">
          <Link href="/">
            <span className="font-mono font-medium">TayLabs</span>
          </Link>
          {subDirectory && (
            <>
              <span>{' / '}</span>
              <span className="font-mono font-light">{subDirectory}</span>
            </>
          )}
        </h1>
        <div>
          {user === undefined ? (
            <span>loading...</span>
          ) : user !== null ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  {user.profile.displayName ||
                    `${user.profile.firstName} ${user.profile.lastName}`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/account">
                  <DropdownMenuItem>
                    <SettingsIcon />
                    <span>Account</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button variant="default">Login</Button>
            </Link>
          )}
          {isMobile && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsOpen((prev) => !prev)}>
              <MenuIcon />
            </Button>
          )}
        </div>
      </header>
    </div>
  );
}
