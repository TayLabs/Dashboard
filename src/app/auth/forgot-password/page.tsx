import ForgotPasswordForm from './ForgotPasswordForm';

export default function ForgotPasswordPage() {
	return (
		<section>
			<div className='mb-16'>
				<h2 className='text-4xl font-medium mb-4'>Forgot Password</h2>
				<p className='text-muted-foreground'>
					Enter your email and we&#39;ll send a link to reset your password
				</p>
			</div>
			<ForgotPasswordForm />
		</section>
	);
}
