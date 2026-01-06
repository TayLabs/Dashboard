import LoginForm from './LoginForm';

export default function LoginPage() {
	return (
		<section className='container max-w-sm'>
			<h1 className='text-3xl font-semibold mb-4'>Welcome back</h1>
			<p className='text-muted-foreground mb-10'>
				Login to manage your environment.
			</p>
			<LoginForm />
		</section>
	);
}
