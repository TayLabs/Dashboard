import { isAuthenticated } from '@/lib/auth';
import EditProfileForm from './components/EditProfileForm';
import { getProfile } from '@/actions/profile';

export default async function AccountPage() {
  await isAuthenticated();

  const user = await getProfile();

  return (
    <section className="container max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
      <EditProfileForm profile={user?.profile || undefined} />
    </section>
  );
}
