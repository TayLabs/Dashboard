'use client';

import { signup } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useForm } from '@tanstack/react-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import z from 'zod';

const signupFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  email: z.string().min(1, 'Email field is required'),
  password: z.string().min(1, 'Password field is required'),
  passwordConfirm: z.string().min(1, 'Password confirm field is required'),
});

const signupFormSchemaOnBlur = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    password: z.string(),
    passwordConfirm: z.string(),
  })
  .refine(
    (data) => !data.passwordConfirm || data.password === data.passwordConfirm,
    {
      error: 'Passwords do not match',
      path: ['passwordConfirm'],
    }
  );

export default function SignupForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
    validators: {
      onBlur: signupFormSchemaOnBlur,
      onSubmit: signupFormSchema,
      onSubmitAsync: async ({ value: data }) => {
        const response = await signup(data);

        if (!response.success) {
          if (response.error) toast.error(response.error);

          return {
            fields: {
              firstName: { message: response.errors?.firstName },
              lastName: { message: response.errors?.lastName },
              email: { message: response.errors?.email },
              password: { message: response.errors?.password },
              passwordConfirm: { message: response.errors?.passwordConfirm },
            },
          };
        } else {
          switch (response.pending) {
            case '2fa':
              router.push('/auth/2fa');
              break;
            case 'passwordReset':
              router.push('/auth/reset-password');
              break;
            case 'emailVerification': // Should only ever be pending emailVerification as it's a new account, keeping others just incase
              router.push('/auth/verify-email');
              break;
            default:
              router.push('/');
              break;
          }
        }
      },
    },
  });

  return (
    <div className="grid gap-6">
      <form
        id="signup-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}>
        <FieldGroup>
          <form.Field
            name="firstName"
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>First Name</FieldLabel>
                  <Input
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
            name="lastName"
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Last Name</FieldLabel>
                  <Input
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
            name="email"
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
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
                  <FieldLabel>Confirm Password</FieldLabel>
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
      <form.Subscribe
        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            form="signup-form"
            className="mt-4 w-full"
            disabled={!canSubmit}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        )}
      </form.Subscribe>
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
