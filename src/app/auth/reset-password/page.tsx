import { isAuthenticated } from '@/lib/auth';
import ResetPasswordForm from './ResetPasswordForm';

export default async function ResetPasswordPage() {
	await isAuthenticated({ allowPending: ['passwordReset'] });

	return (
		<section className='container max-w-sm'>
			<h1 className='text-3xl font-semibold mb-4'>Reset password</h1>
			<p className='text-muted-foreground mb-10'>
				Secure your account by resetting your password.
			</p>
			<ResetPasswordForm />
		</section>
	);
}
