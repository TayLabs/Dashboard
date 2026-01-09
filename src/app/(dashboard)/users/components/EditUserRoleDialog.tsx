'use client';

import { updateRoles } from '@/actions/users';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import type { User } from '@/types/User';
import { useForm } from '@tanstack/react-form';
import type { UUID } from 'node:crypto';
import { type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import useSWR from 'swr';
import { Role } from '@/actions/types/interface/Role';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Loader2Icon } from 'lucide-react';

type EditUserRoleDialogProps = Readonly<{
  user: User;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}>;

const editUserRoleSchema = z.object({
  roles: z.array(z.uuid(), 'Invalid array of UUIDs'),
});

export default function EditUserRoleDialog({
  user,
  isOpen,
  setIsOpen,
}: EditUserRoleDialogProps) {
  const { accessToken } = useSession();

  const fetcher = (url: string) =>
    fetch(url, {
      method: 'GET',
      headers: { Authorize: `Bearer ${accessToken}` },
    }).then((r) => r.json());
  const {
    data: roleData,
    error: roleError,
    isLoading: isRoleLoading,
  } = useSWR<{ roles: Role[] }>(
    isOpen ? 'http://localhost:7313/api/v1/admin/roles' : null,
    fetcher
  );
  const {
    data: userRoleData,
    error: userRoleError,
    isLoading: isUserRoleLoading,
  } = useSWR<{ roles: Role[] }>(
    isOpen ? `http://localhost:7313/api/v1/admin/users/${user.id}/roles` : null,
    fetcher
  );

  const form = useForm({
    defaultValues: {
      roles: [] as string[],
    },
    validators: {
      onSubmit: editUserRoleSchema,
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
      toast.success("This user's roles have been updated");
      setIsOpen(false);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form
        id="edit-user-roles-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}>
        <DialogContent>
          <DialogTitle>
            Edit roles assigned to&nbsp;
            {user.profile.displayName ||
              `${user.profile.firstName} ${user.profile.lastName}`}
          </DialogTitle>
          <DialogDescription>Add roles to a user</DialogDescription>
          {isRoleLoading || isUserRoleLoading ? (
            <Loader2Icon className="animate-spin" />
          ) : roleError || userRoleError ? (
            <Alert>
              <AlertTitle>
                There was an error fetching roles, please try again
              </AlertTitle>
            </Alert>
          ) : (
            <></>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="edit-user-roles-form">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
