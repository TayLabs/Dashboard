import Link from 'next/link';

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<header className='w-full px-12 py-8 flex items-center'>
				<h1 className='text-xl'>
					<Link href='/'>
						<span className='font-mono font-medium'>TayLabs</span>
					</Link>
					{/* <span>{' / '}</span>
					<span className='font-mono font-light'>Dashboard</span> */}
				</h1>
			</header>
			<main className='flex justify-center items-center py-8 px-4'>
				{children}
			</main>
		</>
	);
}
