import { getAllRoles } from '@/actions/roles';
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
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

export default async function RolesPage() {
  const response = await getAllRoles();

  if (!response.success) {
    return <p>Error getting roles: {response.error}</p>;
  }

  return (
    <div className="container max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
      <h1 className="text-3xl font-medium">Select a role</h1>
      <section>
        <h3 className="text-xl font-medium my-4">Roles</h3>
        {response.roles.length > 0 ? (
          <ItemGroup className="gap-4">
            {response.roles.map((role) => (
              <Item key={role.name} variant="outline">
                <ItemContent>
                  <ItemTitle>
                    <h5 className="text-lg font-normal">{role.name}</h5>
                  </ItemTitle>
                  <ItemDescription>{`${role.permissions.length} permissions`}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Link href={`/roles/${role.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </ItemActions>
              </Item>
            ))}
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
