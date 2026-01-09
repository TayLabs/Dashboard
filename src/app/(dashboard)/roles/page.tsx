import { getAllRoles } from '@/actions/roles';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';
import { AlertCircleIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';

export default async function RolesPage() {
  const response = await getAllRoles();

  if (!response.success) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Error loading roles</AlertTitle>
        <AlertDescription>
          <p>{response.error} - Please refresh to try again</p>
        </AlertDescription>
      </Alert>
    );
  }

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
              <BreadcrumbPage>Roles</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-medium">Roles</h1>
      </div>
      <section>
        {response.roles.length > 0 ? (
          <ItemGroup className="gap-4">
            {response.roles.map((role) => (
              <Item key={role.name} variant="outline">
                <ItemContent>
                  <ItemTitle>
                    <h5 className="text-lg font-normal">
                      <span>{role.name}</span>
                      {!role.isExternal && (
                        <>
                          &nbsp;
                          <sup className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-1">
                            internal
                          </sup>
                        </>
                      )}
                    </h5>
                  </ItemTitle>
                  <ItemDescription>{`${role.permissions.length} permissions`}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Link href={`/roles/${role.id}`}>
                    <Button variant="outline" size="sm">
                      {!role.isExternal ? 'View' : 'Edit'}
                    </Button>
                  </Link>
                </ItemActions>
              </Item>
            ))}
            <Link href="/roles/add-role">
              <Button variant="outline" className="w-full">
                <PlusIcon />
                <span>Add a role</span>
              </Button>
            </Link>
          </ItemGroup>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>There are no roles defined yet</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
              <Link href="roles/add-role">
                <Button>
                  <PlusIcon />
                  <span>Add a role</span>
                </Button>
              </Link>
            </EmptyContent>
          </Empty>
        )}
      </section>
    </div>
  );
}
