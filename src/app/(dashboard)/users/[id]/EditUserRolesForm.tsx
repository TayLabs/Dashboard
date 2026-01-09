'use client';

import { Role } from '@/actions/types/interface/Role';
import { updateRoles } from '@/actions/users';
import RolesInput from '@/components/RolesInput';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { User } from '@/types/User';
import { useForm } from '@tanstack/react-form';
import type { UUID } from 'node:crypto';
import { toast } from 'sonner';

export default function EditUserRolesForm({
  user,
  roles,
}: Readonly<{ user: User & { roles: Role[] }; roles: Role[] }>) {
  const form = useForm({
    defaultValues: {
      roles: user.roles.map((role) => role.id) as string[],
    },
    validators: {
      onSubmitAsync: async ({ value: data }) => {
        const response = await updateRoles(user.id, data.roles as UUID[]);

        if (!response.success) {
          toast.error(response.error);

          return {
            roles: response.errors?.roles,
          };
        }
      },
    },
    onSubmit: () => {
      toast.success('Roles updated for user');
    },
  });

  return (
    <form
      id="edit-user-roles-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
      <FieldGroup>
        <form.Field name="roles" mode="array">
          {(field) => (
            <Field>
              <FieldLabel>Roles</FieldLabel>
              <RolesInput
                roles={roles}
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
        </form.Field>
      </FieldGroup>
      <form.Subscribe
        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            form="edit-user-roles-form"
            className="mt-4 w-full"
            disabled={!canSubmit}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
