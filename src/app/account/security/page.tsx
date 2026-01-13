import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';
import { isAuthenticated } from '@/lib/auth';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import EnableTwoFactorSwitch from './EnableTwoFactorSwitch';

export default async function SecurityPage() {
  await isAuthenticated();

  return (
    <section className="container max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
      <h3 className="text-2xl font-medium">Two-Factor authentication</h3>
      <EnableTwoFactorSwitch />
      <ItemGroup className="gap-6">
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>TOTP</ItemTitle>
            <ItemDescription>
              A totp token is linked to your account
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline">Edit</Button>
            <Button
              variant="destructive"
              size="icon"
              className="bg-transparent hover:bg-red-600/5 border border-red-600 text-red-600">
              <Trash2Icon />
            </Button>
          </ItemActions>
        </Item>
        <Button variant="outline" className="w-full">
          <PlusIcon />
          <span>Add two-factor method</span>
        </Button>
      </ItemGroup>
    </section>
  );
}
