import { isAuthenticated } from '@/lib/auth';
import EditProfileForm from './components/EditProfileForm';
import { getProfile } from '@/actions/profile';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

export default async function AccountPage() {
  await isAuthenticated();

  const user = await getProfile();

  return (
    <div className="container max-w-2xl flex flex-col gap-8">
      <div className="grid gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-medium">Profile</h1>
        <p className="text-muted-foreground">
          Edit account information that other users will see when viewing your
          profile
        </p>
      </div>
      <section className="grid gap-6">
        <EditProfileForm profile={user?.profile || undefined} />
      </section>
    </div>
  );
}
