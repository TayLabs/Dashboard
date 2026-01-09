import { getAllRoles } from '@/actions/roles';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { AlertCircleIcon } from 'lucide-react';
import type { UUID } from 'node:crypto';
import EditUserRolesForm from './EditUserRolesForm';
import { getUserWithRoles } from '@/actions/users';

export default async function UserPage({
  params,
}: Readonly<{ params: Promise<{ id: UUID }> }>) {
  const { id } = await params;

  const response = await getUserWithRoles(id);
  const responseAllRoles = await getAllRoles();

  return (
    <section className="container max-w-2xl">
      <div className="grid gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/services">Users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {response.success
                  ? 'Edit ' +
                    (response.user.profile.displayName ||
                      `${response.user.profile.firstName} ${response.user.profile.lastName}`)
                  : 'Edit user'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-semibold mb-4">
          {response.success
            ? 'Edit ' +
              (response.user.profile.displayName ||
                `${response.user.profile.firstName} ${response.user.profile.lastName}`)
            : 'Edit user'}
        </h1>
      </div>
      <p className="text-muted-foreground mb-10">
        Modify the roles a user is part of
      </p>
      {!response.success || !responseAllRoles.success ? (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Error loading data for user</AlertTitle>
          <AlertDescription>
            <p>
              Could not load the roles associated with this user, please refresh
              to try again.
            </p>
          </AlertDescription>
        </Alert>
      ) : (
        <EditUserRolesForm
          user={response.user}
          roles={responseAllRoles.roles}
        />
      )}
    </section>
  );
}
