'use client';

import { login } from '@/actions/auth';
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

const loginFormSchema = z.object({
	email: z.string().min(1, 'Email field is required'),
	password: z.string().min(1, 'Password field is required'),
});

export default function LoginForm() {
	const router = useRouter();
	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		validators: {
			onSubmit: loginFormSchema,
			onSubmitAsync: async ({ value: data }) => {
				const response = await login(data);

				if (!response.success) {
					if (response.error) toast.error(response.error);

					return {
						email: response.errors?.email,
						password: response.errors?.password,
					};
				} else if (response.pending) {
					switch (response.pending) {
						case '2fa':
							router.push('/auth/2fa');
						case 'passwordReset':
							router.push('/auth/reset-password');
						case 'emailVerification':
							router.push('/auth/verify-email');
					}
				}
			},
		},
		onSubmit: () => {
			router.push('/');
		},
	});

	return (
		<div className='grid gap-6'>
			<form
				id='login-form'
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}>
				<FieldGroup>
					<form.Field
						name='email'
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
						name='password'
						// eslint-disable-next-line react/no-children-prop
						children={(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel>Password</FieldLabel>
									<Input
										type='password'
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										required
										aria-invalid={isInvalid}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
									<FieldDescription className='text-right underline-offset-2'>
										<Link href='/auth/forgot-password'>Forgot Password?</Link>
									</FieldDescription>
								</Field>
							);
						}}
					/>
				</FieldGroup>
			</form>
			<Button type='submit' form='login-form'>
				Login
			</Button>
			<Separator />
			<p className='mx-auto'>
				<span className='text-gray-500'>{"Don't have an account? "}</span>
				<Link href='/auth/sign-up' className='underline underline-offset-3'>
					Sign up
				</Link>
			</p>
		</div>
	);
}
