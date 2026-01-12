import { isAuthenticated } from '@/lib/auth';

export default async function SecurityPage() {
  await isAuthenticated();

  return (
    <section className="container max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8"></section>
  );
}
