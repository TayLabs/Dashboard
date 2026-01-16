'use client';

import LogoutButton from '@/components/LogoutButton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
	const pathname = usePathname();
	return (
		<header className='w-full px-12 py-8 flex items-center justify-between'>
			<h1 className='text-xl'>
				<Link href='/'>
					<span className='font-mono font-medium'>TayLabs</span>
				</Link>
				{/* <span>{' / '}</span>
					<span className='font-mono font-light'>Dashboard</span> */}
			</h1>
			{!['/auth/login', '/auth/sign-up', '/auth/forgot-password'].includes(
				pathname
			) && <LogoutButton />}
		</header>
	);
}
