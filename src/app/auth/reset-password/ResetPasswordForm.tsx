'use client';

import { resetPassword } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useForm } from '@tanstack/react-form';
import Link from 'next/link';
import { toast } from 'sonner';
import z from 'zod';

const resetPasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Password field is required'),
    password: z.string().min(1, 'Password field is required'),
    passwordConfirm: z.string().min(1, 'Password field is required'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    error: 'Passwords do not match',
    path: ['passwordConfirm'],
  });

export default function ResetPasswordForm() {
  const form = useForm({
    defaultValues: {
      currentPassword: '',
      password: '',
      passwordConfirm: '',
    },
    validators: {
      onSubmit: resetPasswordFormSchema,
      onSubmitAsync: async ({ value: data }) => {
        const response = await resetPassword(data);

        if (!response.success) {
          if (response.error) toast.error(response.error);
          return {
            email: response.errors?.email,
            password: response.errors?.password,
          };
        }
      },
    },
    onSubmit: () => {
      toast.success('Password reset successfully');
    },
  });

  return (
    <div className="grid gap-6">
      <form
        id="password-reset-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}>
        <FieldGroup>
          <form.Field
            name="currentPassword"
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Current password</FieldLabel>
                  <Input
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="password"
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="passwordConfirm"
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Confirm</FieldLabel>
                  <Input
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
      </form>
      <Button type="submit" form="password-reset-form">
        Save
      </Button>
      <Separator />
      <p className="mx-auto">
        <span className="text-gray-500">{"Don't have an account? "}</span>
        <Link href="/auth/sign-up" className="underline underline-offset-3">
          Sign up
        </Link>
      </p>
    </div>
  );
}
