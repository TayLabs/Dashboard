'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import Link from 'next/link';

export default function Header() {
  const { user } = useUser();

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl">
        <Link href="/">
          <span className="font-mono font-medium">TayLabs</span>
        </Link>
        {/* <span>{' / '}</span>
					<span className='font-mono font-light'>Dashboard</span> */}
      </h1>
      <div>
        {user !== null ? (
          <span className="mr-4">
            Hello, {`${user?.profile.firstName} ${user?.profile.lastName}`}
          </span>
        ) : (
          <Link href="/auth/login">
            <Button variant="default" asChild>
              Login
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
