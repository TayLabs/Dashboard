import { getAllServices } from '@/actions/services';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';
import Link from 'next/link';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import { PlusIcon } from 'lucide-react';

export default async function ServicesPage() {
  const response = await getAllServices();

  if (!response.success) {
    return <p>Error getting services: {response.error}</p>;
  }

  const internal = response.services.filter((service) => !service.isExternal);
  const external = response.services.filter((service) => service.isExternal);

  return (
    <div className="container max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
      <h1 className="text-3xl font-medium">Select a service</h1>
      <section>
        <h3 className="text-xl font-medium my-4">External Services</h3>
        <ItemGroup className="gap-4">
          {external.length > 0 ? (
            external.map((service) => (
              <Item key={service.name} variant="outline">
                <ItemContent>
                  <ItemTitle>
                    <h5 className="text-lg font-normal">{service.name}</h5>
                  </ItemTitle>
                  <ItemDescription>{`${service.permissions.length} permissions`}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Link href={`/services/${service.name}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </ItemActions>
              </Item>
            ))
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No external services</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t linked any services yet
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Link href="/services/add-service">
                  <Button>
                    <PlusIcon />
                    <span>Register a service</span>
                  </Button>
                </Link>
              </EmptyContent>
            </Empty>
          )}
          {external.length > 0 && (
            <Link href="/services/add-service">
              <Button variant="outline" className="w-full">
                Register a new service
              </Button>
            </Link>
          )}
        </ItemGroup>
        {internal && (
          <>
            <h3 className="text-xl font-medium my-4">
              Internal TayLab Services
            </h3>
            <ItemGroup className="gap-4">
              {internal.map((service) => (
                <Item key={service.name} variant="outline">
                  <ItemContent>
                    <ItemTitle>
                      <h5 className="text-lg font-normal">{service.name}</h5>
                    </ItemTitle>
                    <ItemDescription>{`${service.permissions.length} permissions`}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    {service.keysId && (
                      <Link href={`/services/${service.name}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    )}
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </>
        )}
      </section>
    </div>
  );
}
