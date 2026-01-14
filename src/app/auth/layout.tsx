import LogoutButton from '@/components/LogoutButton';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="w-full px-12 py-8 flex items-center justify-between">
        <h1 className="text-xl">
          <Link href="/">
            <span className="font-mono font-medium">TayLabs</span>
          </Link>
          {/* <span>{' / '}</span>
					<span className='font-mono font-light'>Dashboard</span> */}
        </h1>
        <LogoutButton />
      </header>
      <main className="flex justify-center items-center py-8 px-4">
        {children}
      </main>
    </>
  );
}
