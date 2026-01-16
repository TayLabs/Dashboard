import Header from './components/Header';

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header />
			<main className='flex justify-center items-center py-8 px-4'>
				{children}
			</main>
		</>
	);
}
