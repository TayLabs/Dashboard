'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/types/User';
import { ColumnDef } from '@tanstack/react-table';
import { LockIcon, MoreHorizontalIcon, UsersIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmPasswordResetDialog } from './ConfirmPasswordResetDialog';
import { UUID } from 'node:crypto';
import { forcePasswordReset } from '@/actions/users';
import EditUserRoleDialog from './EditUserRoleDialog';

const handleReset = async (userId: UUID) => {
  const response = await forcePasswordReset(userId);

  if (!response.success) toast.error(response.error);
  else toast.success('User will be prompted to reset their password');
};

export const columns: ColumnDef<User>[] = [
  {
    header: 'Name',
    accessorFn: (row) =>
      row.profile.displayName ||
      `${row.profile.firstName} ${row.profile.lastName}`,
  },
  {
    header: 'Email',
    accessorKey: 'email',
  },
  {
    header: 'Phone Number',
    accessorKey: 'phoneNumber',
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isPassResetOpen, setIsPassResetOpen] = useState<boolean>(false);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isEditRoleOpen, setIsEditRoleOpen] = useState<boolean>(false);

      const user = row.original;

      return (
        <>
          <ConfirmPasswordResetDialog
            isOpen={isPassResetOpen}
            setIsOpen={setIsPassResetOpen}
            onResetConfirm={() => handleReset(user.id)}
          />
          <EditUserRoleDialog
            user={user}
            isOpen={isEditRoleOpen}
            setIsOpen={setIsEditRoleOpen}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditRoleOpen(true);
                }}>
                <UsersIcon />
                <span>Edit Role assignments</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                // variant="destructive"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPassResetOpen(true);
                }}>
                <LockIcon />
                <span>Force Password reset</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
