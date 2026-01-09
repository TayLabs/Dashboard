'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { type Dispatch, type SetStateAction } from 'react';

type ConfirmPasswordResetDialog = Readonly<{
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onResetConfirm: () => void;
}>;

export function ConfirmPasswordResetDialog({
  isOpen,
  setIsOpen,
  onResetConfirm,
}: ConfirmPasswordResetDialog) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>
          Confirm whether to force a password reset for this user or not
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onResetConfirm}>Confirm</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
