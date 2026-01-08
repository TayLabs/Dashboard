import { getRole } from '@/actions/roles';
import { Role } from '@/actions/types/interface/Role';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { UUID } from 'node:crypto';
import EditRoleForm from './EditRoleForm';
import { getAllServices } from '@/actions/services';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

type EditRolePageProps = {
  params: Promise<{ id: UUID | 'add-role' }>;
};

export default async function EditRolePage({ params }: EditRolePageProps) {
  const getAllServicesPromise = getAllServices();

  const { id } = await params;

  let response:
    | { success: true; role: Role }
    | { success: false; error: string }
    | null = null;
  if (id !== 'add-role') {
    response = await getRole(id);
  }

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
              <BreadcrumbLink href="/services">Services</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {!response && id === 'add-role'
                  ? 'Add role'
                  : response?.success
                  ? `Edit ${response.role.name} role`
                  : 'Edit role'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-semibold mb-4">
          {!response && id === 'add-role'
            ? 'Add a role'
            : response?.success
            ? `Edit ${response.role.name} role`
            : 'Edit role'}
        </h1>
      </div>
      <p className="text-muted-foreground mb-10">
        Modify a role within your environment to add permissions or change the
        name of it. Internal roles are automatically populated via a&nbsp;
        <code className="bg-muted px-2 rounded-sm shadow-xs">
          taylab.config.yml
        </code>
        &nbsp;and cannot be modified.
      </p>
      {response && !response.success ? (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Error loading the role with a id of {id}</AlertTitle>
          <AlertDescription>{response.error}</AlertDescription>
        </Alert>
      ) : (
        <EditRoleForm
          getAllServicesPromise={getAllServicesPromise}
          role={response?.success ? response.role : undefined}
        />
      )}
    </section>
  );
}
