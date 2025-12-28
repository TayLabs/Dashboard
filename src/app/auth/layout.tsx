export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<header className='w-full px-6 py-4 flex items-center'>
				<h1 className='text-xl'>
					<span className='font-mono font-medium'>TayLabs</span>
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
