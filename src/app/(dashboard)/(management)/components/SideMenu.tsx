'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { useSideMenu } from '@/hooks/use-sidemenu';
import { cn } from '@/utils';
import {
  HomeIcon,
  KeyIcon,
  ServerIcon,
  UsersIcon,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

type MenuItem = {
  title: string;
  url: string;
  Icon: LucideIcon;
};

const menuItems = [
  { title: 'Services', url: '/services', Icon: ServerIcon },
  { title: 'Roles', url: '/services/roles', Icon: UsersIcon },
  { title: 'Keys', url: '/services?selectFor=keys', Icon: KeyIcon },
] satisfies MenuItem[];

const sideMenuWidthClassName = 'md:w-72';

export default function SideMenu() {
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
          {menuItems.map(({ title, url, Icon }, i) => (
            <Link
              key={`${i}-${title}`}
              className="text-xl font-medium grid grid-cols-[auto_1fr] gap-4 items-center hover:bg-muted hover:shadow-sm cursor-pointer transition-[background-color_box-shadow] duration-300 px-5 py-3 rounded-lg"
              href={url}>
              <Icon className="size-5" />
              {title}
            </Link>
          ))}
        </nav>
        <div>{/* Dropdown menu for profile settings */}</div>
      </aside>
    </div>
  );
}
