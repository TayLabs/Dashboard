import Heading from './components/Heading';
import { Button } from '@/components/ui/button';
import { isAuthenticated } from '@/lib/auth';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { FolderCodeIcon } from 'lucide-react';
import Link from 'next/link';
import { getAllServices } from '@/actions/services';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';
import { getAllUsers } from '@/actions/users';

export default async function HomePage() {
  await isAuthenticated();

  const response = await getAllServices();
  const responseUsers = await getAllUsers();

  return (
    <div className="container max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
      <Heading />
      <section id="services">
        <h2 className="text-2xl font-semibold mb-4">Your linked services</h2>
        {!response.success ? (
          <Alert variant="destructive">
            <AlertTitle>Error fetching services, try refreshing</AlertTitle>
            <AlertDescription>{response.error}</AlertDescription>
          </Alert>
        ) : response.services.filter((service) => service.isExternal).length >
          0 ? (
          <ItemGroup className="gap-4">
            {response.services
              .filter((service) => service.isExternal)
              .map((service) => (
                <Item key={service.name} variant="outline">
                  <ItemContent>
                    <ItemTitle>
                      <h5 className="text-lg font-normal">{service.name}</h5>
                    </ItemTitle>
                    <ItemDescription>{`${service.permissions.length} permissions`}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Link href={`/services/${service.name}`}>
                      <Button variant="outline">Edit</Button>
                    </Link>
                  </ItemActions>
                </Item>
              ))}
          </ItemGroup>
        ) : (
          <Empty className="bg-muted">
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="p-8 bg-background shadow-sm">
                <FolderCodeIcon className="size-8" />
              </EmptyMedia>
              <EmptyTitle>No Projects Yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created any projects yet. Get started by
                creating your first project.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link href="/services/add-service">
                <Button>Register a service</Button>
              </Link>
            </EmptyContent>
          </Empty>
        )}
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Users in your environment
        </h2>
        {!responseUsers.success ? (
          <Alert variant="destructive">
            <AlertTitle>Error fetching services, try refreshing</AlertTitle>
            <AlertDescription>{responseUsers.error}</AlertDescription>
          </Alert>
        ) : (
          <div>
            <Item>
              <ItemContent>
                <ItemTitle>
                  You have&nbsp;
                  {
                    responseUsers.users.filter((user) => user.email !== 'admin')
                      .length
                  }
                  &nbsp;users in your environment
                </ItemTitle>
              </ItemContent>
              <ItemActions>
                <Button variant="secondary">
                  <Link href="/users">See all</Link>
                </Button>
              </ItemActions>
            </Item>
          </div>
        )}
      </section>
    </div>
  );
}
