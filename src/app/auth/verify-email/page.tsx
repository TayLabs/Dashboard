import { isAuthenticated } from '@/lib/auth';
import EmailVerificationSendForm from './EmailVerificationSendForm';

export default async function EmailVerification() {
  await isAuthenticated({ allowPending: ['emailVerification'] });

  return (
    <section className="container max-w-sm">
      <EmailVerificationSendForm />
    </section>
  );
}
