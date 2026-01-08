'use client';
import { Role } from '@/actions/types/interface/Role';
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
import React from 'react';
import { toast } from 'sonner';
import z from 'zod';
import { useRouter } from 'next/navigation';
import { addRole, removeRole, updateRole } from '@/actions/roles';
import type { UUID } from 'node:crypto';
import { Switch } from '@/components/ui/switch';
import PermissionsInput from './PermissionsInput';
import { Service } from '@/actions/types/interface/Service.interface';

const editRoleFormSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  assignToNewUser: z.boolean().transform(Boolean),
  permissions: z.array(
    z.uuid('Must be a valid UUID').transform((str) => str as UUID)
  ),
});

export default function EditRoleForm({
  getAllServicesPromise,
  role,
}: Readonly<{
  getAllServicesPromise: Promise<
    { success: true; services: Service[] } | { success: false; error: string }
  >;
  role?: Role;
}>) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: role?.name || '',
      assignToNewUser: role?.assignToNewUser || false,
      permissions:
        role?.permissions.map((permission) => permission.id as string) ||
        ([] as string[]), // zod array won't type as UUID[] properly and throws validation issues
    },
    validators: {
      onSubmit: editRoleFormSchema,
      onSubmitAsync: async ({ value: data }) => {
        const response = !role
          ? await addRole(data)
          : await updateRole(role.id, data);

        if (!response.success) {
          if (response.error) toast.error(response.error);

          return {
            name: response.errors?.name,
            assignToNewUser: response.errors?.assignToNewUser,
            permissions: response.errors?.permissions,
          };
        }
      },
    },
    onSubmit: () => {
      router.push('/roles');
    },
  });

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const response = await removeRole(role!.id);

    if (!response.success) {
      toast.error(response.error);
    } else {
      router.push('/roles');
    }
  };

  return (
    <form
      id="edit-role-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4">
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
                  autoComplete="role-name"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="assignToNewUser"
          // eslint-disable-next-line react/no-children-prop
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field
                data-invalid={isInvalid}
                orientation="horizontal"
                className="w-fit">
                <FieldLabel>Assign to new users</FieldLabel>
                <Switch
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onCheckedChange={(e) =>
                    field.handleChange(e.valueOf() as boolean)
                  }
                  aria-invalid={isInvalid}
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
                scope="user"
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
      <Button type="submit" form="edit-role-form" className="mt-4 w-full">
        Save
      </Button>
      {role && (
        <Button
          variant="destructive"
          className="mt-4 w-full"
          onClick={handleDelete}>
          Delete
        </Button>
      )}
    </form>
  );
}
