'use client';

import { verifyTOTP } from '@/actions/totp';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useForm } from '@tanstack/react-form';
import z from 'zod';

const twoFactorFormSchema = z.object({
  code: z
    .string('Invalid token format')
    .length(6, 'Token must be 6 digits long')
    .regex(/^\d{6}$/, 'Token must consist of 6 numbers'),
});

export default function TwoFactorForm() {
  const form = useForm({
    defaultValues: {
      code: '',
    },
    validators: {
      onSubmit: twoFactorFormSchema,
      onSubmitAsync: async ({ value: data }) => {
        const response = await verifyTOTP(data);

        if (!response.success) {
          return {
            errors: {
              code: response.error,
            },
          };
        }
      },
    },
  });

  return (
    <form
      id="totp-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
      <FieldGroup>
        <form.Field name="code">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel>Code</FieldLabel>
                <InputOTP
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value)}
                  required
                  maxLength={6}
                  aria-invalid={isInvalid}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Subscribe
          selector={(formState) => [
            formState.canSubmit,
            formState.isSubmitting,
          ]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              form="totp-form"
              className="mt-4 w-full"
              disabled={!canSubmit}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
