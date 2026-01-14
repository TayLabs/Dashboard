'use client';

import { validateTOTP, verifyTOTP } from '@/actions/totp';
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
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useRouter } from 'next/navigation';
import z from 'zod';

const twoFactorFormSchema = z.object({
  code: z
    .string('Invalid token format')
    .length(6, 'Token must be 6 digits long')
    .regex(new RegExp(REGEXP_ONLY_DIGITS), 'Token must consist of 6 numbers'),
});

export default function TwoFactorForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      code: '',
    },
    validators: {
      onChange: ({ value }) => {
        if (value.code.length >= 6) {
          form.handleSubmit();
        }
      },
      onSubmit: twoFactorFormSchema,
      onSubmitAsync: async ({ value: data }) => {
        const response = await validateTOTP(data);

        if (!response.success) {
          return {
            fields: {
              code: [{ message: response.error! }],
            },
          };
        } else {
          switch (response.pending) {
            case 'passwordReset':
              router.push('/auth/reset-password');
              break;
            case 'emailVerification':
              router.push('/auth/verify-email');
              break;
            default:
              router.push('/');
              break;
          }
        }
      },
    },
    onSubmit: () => {},
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
