import { isAuthenticated } from '@/lib/auth';
import ResetPasswordForm from './ResetPasswordForm';

export default async function ResetPasswordPage() {
  await isAuthenticated({ allowPending: ['passwordReset'] });

  return (
    <section className="container max-w-sm">
      <ResetPasswordForm />
    </section>
  );
}
