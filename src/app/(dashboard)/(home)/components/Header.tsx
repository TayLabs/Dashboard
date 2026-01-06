'use client';

import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWindowScrollPosition } from '@/hooks/use-scroll-position';
import { useSideMenu } from '@/hooks/use-sidemenu';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/utils';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

const headerHeightClassName = 'h-12 md:h-18';

export default function Header() {
  const { user } = useUser();
  const scrollPos = useWindowScrollPosition();
  const { setIsOpen } = useSideMenu();
  const isMobile = useIsMobile();

  return (
    <div className={cn('col-span-2', headerHeightClassName)}>
      <header
        className={cn(
          'w-full px-4 md:px-8 flex items-center justify-between fixed top-0 inset-x-0 bg-background/90 backdrop-blur-sm transition-shadow duration-300',
          headerHeightClassName,
          {
            'shadow-xs': scrollPos.y > 10,
          }
        )}>
        <h1 className="text-xl">
          <Link href="/">
            <span className="font-mono font-medium">TayLabs</span>
          </Link>
          {/* <span>{' / '}</span>
					<span className='font-mono font-light'>Dashboard</span> */}
        </h1>
        <div>
          {user === undefined ? (
            <span>loading...</span>
          ) : user !== null ? (
            <span className="mr-4">Hello, {user?.profile.displayName}</span>
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
