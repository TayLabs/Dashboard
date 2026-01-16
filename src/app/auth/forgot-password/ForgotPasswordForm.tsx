'use client';

import { requestReset } from '@/actions/forgotPassword';
import { Button } from '@/components/ui/button';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from '@tanstack/react-form';
import z from 'zod';

const forgotPasswordFormSchema = z.object({
	email: z.email(),
});

export default function ForgotPasswordForm() {
	const form = useForm({
		defaultValues: {
			email: '',
		},
		validators: {
			onSubmit: forgotPasswordFormSchema,
			onSubmitAsync: async ({ value: data }) => {
				const response = await requestReset(data);

				if (!response.success) {
					return {
						fields: {
							email: { message: response.error },
						},
					};
				}
			},
		},
	});

	return (
		<form
			id='forgot-password-form'
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}>
			<FieldGroup>
				<form.Field name='email'>
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field>
								<FieldLabel>Email</FieldLabel>
								<Input
									placeholder='john.doe@example.com'
									type='email'
									id={field.name}
								/>
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
							type='submit'
							form='forgot-password-form'
							className='mt-4 w-full'
							disabled={!canSubmit}>
							{isSubmitting ? 'Sending...' : 'Send'}
						</Button>
					)}
				</form.Subscribe>
			</FieldGroup>
		</form>
	);
}
