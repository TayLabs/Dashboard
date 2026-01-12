import { isAuthenticated } from '@/lib/auth';
import TwoFactorForm from './TwoFactorForm';

export default async function TwoFactorPage() {
  await isAuthenticated({ allowPending: ['2fa'] });

  return (
    <section className="container max-w-sm">
      <h1 className="text-3xl font-semibold mb-4">Two Factor</h1>
      <p className="text-muted-foreground mb-10">
        Verify your identity by inputing the code listed in your authenticator
        app.
      </p>
      <TwoFactorForm />
    </section>
  );
}
