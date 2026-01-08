'use client';

import { Key } from '@/actions/types/interface/Key';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from '@tanstack/react-form';
import React, { useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import { useRouter } from 'next/navigation';
import { addKey, removeKey, updateKey } from '@/actions/keys';
import type { UUID } from 'node:crypto';
import PermissionsInput from '../../../../components/PermissionsInput';
import { Service } from '@/actions/types/interface/Service.interface';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';

const editKeyFormSchema = z.object({
  name: z.string().min(1, 'Key name is required'),
  permissions: z.array(
    z.uuid('Must be a valid UUID').transform((str) => str as UUID),
    'Invalid permissions selected'
  ),
});

export default function EditKeyForm({
  getAllServicesPromise,
  keyData,
}: Readonly<{
  getAllServicesPromise: Promise<
    { success: true; services: Service[] } | { success: false; error: string }
  >;
  keyData?: Key;
}>) {
  const router = useRouter();
  const [id, setId] = useState<UUID | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      name: keyData?.name || '',
      permissions:
        keyData?.permissions?.map((permission) => permission.id as string) ||
        ([] as string[]), // zod array won't type as UUID[] properly and throws validation issues
    },
    validators: {
      onSubmit: editKeyFormSchema,
      onSubmitAsync: async ({ value: data }) => {
        const response = !keyData
          ? await addKey(data)
          : await updateKey(keyData.id, data);

        if (!response.success) {
          if (response.error) toast.error(response.error);

          return {
            name: response.errors?.name,
            assignToNewUser: response.errors?.assignToNewUser,
            permissions: response.errors?.permissions,
          };
        } else {
          setNewKeyValue(response.apiKey);
          setId(response.key.id);
        }
      },
    },
    onSubmit: () => {
      console.log({ id, newKeyValue });
      if (id) {
        router.push(`/keys/${id}`);
      }

      if (newKeyValue) setIsOpen(true);

      toast.success('Changes have been saved');
    },
  });

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const response = await removeKey(keyData!.id);

    if (!response.success) {
      toast.error(response.error);
    } else {
      router.push('/keys');
    }
  };

  return (
    <>
      <form
        id="edit-key-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4 mt-8">
        <FieldGroup className="gap-4">
          <form.Field
            name="name"
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                    aria-invalid={isInvalid}
                    autoComplete="key-name"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <FieldSeparator />
          <form.Field
            name="permissions"
            mode="array"
            // eslint-disable-next-line react/no-children-prop
            children={(field) => (
              <Field>
                <FieldLabel>
                  <h4 className="text-2xl">Permissions</h4>
                </FieldLabel>
                <PermissionsInput
                  getAllServicesPromise={getAllServicesPromise}
                  scope="api-key"
                  value={field.state.value as UUID[]}
                  onChange={(id, action) =>
                    field.setValue((values) => {
                      if (action === 'delete') {
                        const i = values.indexOf(id);
                        if (i > -1) values.splice(i, 1);
                        return values;
                      } else {
                        values.push(id);
                        return values;
                      }
                    })
                  }
                  onBlur={field.handleBlur}
                />
              </Field>
            )}
          />
        </FieldGroup>
        <form.Subscribe
          selector={(formState) => [
            formState.canSubmit,
            formState.isSubmitting,
          ]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              form="edit-key-form"
              className="mt-4 w-full"
              disabled={!canSubmit}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          )}
        </form.Subscribe>
        {keyData && (
          <Button
            variant="destructive"
            className="mt-4 w-full"
            onClick={handleDelete}>
            Delete
          </Button>
        )}
      </form>
      <Dialog
        open={isOpen && Boolean(newKeyValue)}
        onOpenChange={(open) => {
          setNewKeyValue(null);
          setIsOpen(open);
        }}>
        <DialogContent>
          <DialogTitle>New API Key</DialogTitle>
          <DialogDescription>
            Below is your new api key. Be sure to copy it somewhere safe as it
            will not be available again!
          </DialogDescription>
          <p>{newKeyValue}</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="default">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
