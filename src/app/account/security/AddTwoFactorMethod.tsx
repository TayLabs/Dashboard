'use client';

import { createTOTP, removeTOTP, verifyTOTP } from '@/actions/totp';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from '@tanstack/react-form';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { PlusIcon } from 'lucide-react';
import Image from 'next/image';
import type { UUID } from 'node:crypto';
import { useState } from 'react';
import z from 'zod';

type TOTPTokenRecord = {
  id: UUID;
};

const addTwoFactorFormSchema = z.object({
  code: z
    .string('Invalid token format')
    .length(6, 'Token must be 6 digits long')
    .regex(new RegExp(REGEXP_ONLY_DIGITS), 'Token must consist of 6 numbers'),
});

export default function AddTwoFactorMethod() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<{ error: string } | string | null>();
  const [totpRecord, setTotpRecord] = useState<TOTPTokenRecord | undefined>();
  const form = useForm({
    defaultValues: {
      code: '',
    },
    validators: {
      onSubmit: addTwoFactorFormSchema,
      onSubmitAsync: async ({ value: data }) => {
        const response = await verifyTOTP(totpRecord!.id, data);

        if (!response.success) {
          return {
            fields: {
              code: [{ message: response.error }],
            },
          };
        }
      },
    },
    onSubmit: () => {
      setQrCode(null);
      setTotpRecord(undefined);
      setIsOpen(false);
      form.reset();
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={async (open) => {
        setIsOpen(open);

        if (open) {
          const response = await createTOTP();

          if (!response.success) {
            setTotpRecord(undefined);
            setQrCode({ error: response.error! });
          } else {
            setTotpRecord(response.totpTokenRecord);
            setQrCode(response.qrCode);
          }
        } else {
          if (totpRecord) await removeTOTP(totpRecord.id);

          setQrCode(null);
          setTotpRecord(undefined);
        }
      }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <PlusIcon />
          <span>Add two-factor method</span>
        </Button>
      </DialogTrigger>
      <form
        id="add-two-factor-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Authenticator App</DialogTitle>
            <DialogDescription>
              Link an authenticator app with a one time passcode (TOTP). This
              will be a 6-digit code you input upon login
            </DialogDescription>
          </DialogHeader>
          {typeof qrCode !== 'string' ? (
            qrCode ? (
              <Alert variant="destructive">
                <AlertTitle>Error creating TOTP token record</AlertTitle>
                <AlertDescription>{qrCode.error}</AlertDescription>
              </Alert>
            ) : (
              <p>Loading...</p>
            )
          ) : (
            <>
              <Image
                src={qrCode}
                alt="QR code to use with authenticator app"
                height={200}
                width={200}
                className="mx-auto border rounded-lg shadow-xs"
              />
              <FieldGroup>
                <form.Field name="code">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel>Verify</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                          aria-invalid={isInvalid}
                          disabled={!qrCode}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>
            </>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button type="submit" form="add-two-factor-form">
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
