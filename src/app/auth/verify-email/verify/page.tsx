import { verifyEmail } from '@/actions/email';
import Link from 'next/link';

type EmailVerificationVerifyProps = {
  searchParams?: Promise<{
    t: string;
  }>;
};

export default async function EmailVerificationVerify({
  searchParams,
}: EmailVerificationVerifyProps) {
  const token = await searchParams?.then(({ t }) => t);

  if (!token) {
    return (
      <section className="container max-w-sm">
        <h3 className="text-xl">Token is missing</h3>
      </section>
    );
  }

  const response = await verifyEmail(token);

  if (!response.success) {
    return (
      <section className="container max-w-sm">
        <h3 className="text-xl">
          {response.error || 'Invalid verification token'}
        </h3>
      </section>
    );
  }

  return (
    <section className="container max-w-sm">
      <h3 className="text-xl">Email verified!</h3>
      <Link href="/" className="underline underline-offset-2">
        View dashboard
      </Link>
    </section>
  );
}
