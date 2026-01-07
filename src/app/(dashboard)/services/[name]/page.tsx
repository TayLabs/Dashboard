import { getService } from '@/actions/services';
import { Service } from '@/actions/types/interface/Service.interface';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import Link from 'next/link';
import EditServiceForm from './EditServiceForm';

type EditServicePageProps = {
  params: Promise<{ name: 'add-service' | string }>;
};

export default async function EditServicePage({
  params,
}: EditServicePageProps) {
  const { name } = await params;

  let serviceResponse:
    | ({ success: true; service: Service } | { success: false; error: string })
    | null = null;
  if (name !== 'add-service') {
    serviceResponse = await getService(name);
  }

  return (
    <section className="container max-w-2xl">
      <h1 className="text-3xl font-semibold mb-4">
        {!serviceResponse && name === 'add-service'
          ? 'Add a service'
          : `${name} service`}
      </h1>
      <p className="text-muted-foreground mb-10">
        Modify a service within your environment to add permissions or change
        the name of it. Internal services are automatically populated via
        a&nbsp;
        <code className="bg-muted px-2 rounded-sm shadow-xs">
          taylab.config.yml
        </code>
        &nbsp;and cannot be modified.
      </p>
      {serviceResponse && !serviceResponse.success ? (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>
            Error loading the service with a name of {name}
          </AlertTitle>
          <AlertDescription>
            <p>
              Would you like to&nbsp;
              <Link
                href={`/services/add-service?name=${name}`}
                className="underline underline-offset-2">
                create a service
              </Link>
              &nbsp;with this name?
            </p>
          </AlertDescription>
        </Alert>
      ) : (
        <EditServiceForm
          service={
            serviceResponse?.success ? serviceResponse.service : undefined
          }
        />
      )}
    </section>
  );
}
