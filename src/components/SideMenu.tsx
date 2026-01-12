'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { useSideMenu } from '@/hooks/use-sidemenu';
import { cn } from '@/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MenuItem = {
  title: string;
  url: string;
};

const menu = {
  '/': [
    { title: 'Home', url: '/' },
    { title: 'Services', url: '/services' },
    { title: 'Keys', url: '/keys' },
    { title: 'Roles', url: '/roles' },
    { title: 'Users', url: '/users' },
  ],
} as Record<string, MenuItem[]>;

const sideMenuWidthClassName = 'md:w-72';

export default function SideMenu() {
  const pathname = usePathname();
  const menuItems =
    menu[
      Object.keys(menu)
        .filter((key) => pathname.startsWith(key))
        .reduce((acc, curr) => (acc.length > curr.length ? acc : curr), '') // Find the most specific matching menu item (longest one is most specific)
    ];

  const { isOpen } = useSideMenu();
  const isMobile = useIsMobile();

  return (
    <div className={cn('h-full', sideMenuWidthClassName)}>
      <aside
        className={cn(
          'fixed bg-background transition-opacity duration-300',
          sideMenuWidthClassName,
          {
            'top-18 bottom-0 left-0': !isMobile,
            'top-18 inset-x-0 bottom-0': isMobile,
            'opacity-0 pointer-events-none': isMobile && !isOpen,
            'opacity-100 pointer-events-auto': isMobile && isOpen,
          }
        )}>
        {/* main side menu items */}
        <nav className="list-none p-4 flex flex-col gap-2 h-full overflow-y-auto">
          {menuItems.map(({ title, url }, i) => (
            <Link
              key={`${i}-${title}`}
              className="text-xl font-medium hover:bg-muted hover:shadow-sm cursor-pointer transition-[background-color_box-shadow] duration-300 px-5 py-3 rounded-lg"
              href={url}>
              {title}
            </Link>
          ))}
        </nav>
        <div>{/* Dropdown menu for profile settings */}</div>
      </aside>
    </div>
  );
}
