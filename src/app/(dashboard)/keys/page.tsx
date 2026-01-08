import { getAllKeys } from '@/actions/keys';
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
import Format from '@/utils/Format';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

export default async function KeysPage() {
  const response = await getAllKeys();

  if (!response.success) {
    return <p>Error getting keys: {response.error}</p>;
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
              <BreadcrumbPage>Keys</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-medium">Select a key</h1>
      </div>
      <section>
        <h3 className="text-xl font-medium my-4">Keys</h3>
        {response.keys.length > 0 ? (
          <ItemGroup className="gap-4">
            {response.keys.map((key) => (
              <Item key={key.name} variant="outline">
                <ItemContent>
                  <ItemTitle>
                    <h5 className="text-lg font-normal">{key.name}</h5>
                  </ItemTitle>
                  <ItemDescription>
                    <span className="block">
                      {/* <span>Key:&nbsp;</span> */}
                      <span className="font-mono">{`****${key.keyLastFour}`}</span>
                      <span>{` - ${
                        key.permissions?.length || 0
                      } permissions`}</span>
                    </span>
                    <span className="block">
                      {`Expires on: ${Format.date(key.expiresAt).dateTime}`}
                    </span>
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Link href={`/keys/${key.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </ItemActions>
              </Item>
            ))}
            <Link href="/keys/add-key">
              <Button variant="outline" className="w-full">
                <PlusIcon />
                <span>Add a key</span>
              </Button>
            </Link>
          </ItemGroup>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>There are no keys defined yet</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
              <Link href="keys/add-key">
                <Button>
                  <PlusIcon />
                  <span>Add a key</span>
                </Button>
              </Link>
            </EmptyContent>
          </Empty>
        )}
      </section>
    </div>
  );
}
