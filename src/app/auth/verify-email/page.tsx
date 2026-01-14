import { isAuthenticated } from '@/lib/auth';
import EmailVerificationSendForm from './EmailVerificationSendForm';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { SendIcon } from 'lucide-react';
import Link from 'next/link';

export default async function EmailVerification() {
  await isAuthenticated({ allowPending: ['emailVerification'] });

  return (
    <section className="container max-w-sm">
      <Empty>
        <EmptyHeader className="w-max">
          <EmptyMedia variant="icon">
            <SendIcon />
          </EmptyMedia>
          <EmptyTitle>Please verify your email</EmptyTitle>
          <EmptyDescription>
            Click the link in the email we sent you to verify your email
            address. Once complete,{' '}
            <Link href="/" className="underline underline-offset-2">
              click here
            </Link>{' '}
            to keep using the app!
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <EmailVerificationSendForm />
        </EmptyContent>
      </Empty>
    </section>
  );
}
