import { getKey } from '@/actions/keys';
import { Key } from '@/actions/types/interface/Key';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon, InfoIcon } from 'lucide-react';
import { UUID } from 'node:crypto';
import EditKeyForm from './EditKeyForm';
import { getAllServices } from '@/actions/services';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

type EditKeyPageProps = {
  params: Promise<{ id: UUID | 'add-key' }>;
};

export default async function EditKeyPage({ params }: EditKeyPageProps) {
  const getAllServicesPromise = getAllServices(); // used to fetch all permissions

  const { id } = await params;

  let response:
    | { success: true; key: Key }
    | { success: false; error: string }
    | null = null;
  if (id !== 'add-key') {
    response = await getKey(id);
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
              <BreadcrumbLink href="/keys">Keys</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {!response && id === 'add-key'
                  ? 'Add key'
                  : response?.success
                  ? `Edit ${response.key.name} key`
                  : 'Edit key'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-semibold mb-4">
          {!response && id === 'add-key'
            ? 'Add a key'
            : response?.success
            ? `Edit ${response.key.name} key`
            : 'Edit key'}
        </h1>
      </div>
      <p className="text-muted-foreground mb-4">
        Modify a key within your environment to add permissions or change the
        name of it. Internal keys are automatically populated via seed data and
        cannot be modified.
      </p>
      {response?.success && !response?.key.isExternal && (
        <Alert className="mb-4">
          <AlertTitle className="inline-flex gap-2 items-center">
            <InfoIcon className="size-5" />
            <span>This key is internal and cannot be edited</span>
          </AlertTitle>
          <AlertDescription>
            Internal keys are automatially seeded to the database upon startup
            and will be overwritten if any changes are made here.
          </AlertDescription>
        </Alert>
      )}
      {response && !response.success ? (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Error loading the key with a id of {id}</AlertTitle>
          <AlertDescription>{response.error}</AlertDescription>
        </Alert>
      ) : (
        <EditKeyForm
          getAllServicesPromise={getAllServicesPromise}
          key={response?.success ? response.key : undefined}
        />
      )}
    </section>
  );
}
