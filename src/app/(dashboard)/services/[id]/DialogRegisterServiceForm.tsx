'use client';

import { registerService } from '@/actions/services';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from '@tanstack/react-form';
import React, { useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import yaml from 'js-yaml';
import PermissionsInput from '../../components/PermissionsInput';
import { Service } from '@/actions/types/interface/Service.interface';

const addServiceFormSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  permissions: z.array(z.string()),
});

export default function DialogRegisterServiceForm({
  service,
  children,
}: Readonly<{ service?: Service; children: React.ReactNode }>) {
  const [open, setOpen] = useState<boolean>(false);
  const [fileErrors, setFileErrors] = useState<{ message?: string }[]>([]);
  const form = useForm({
    defaultValues: {
      name: service?.name || '',
      permissions: service?.permissions || [],
    },
    validators: {
      onSubmit: addServiceFormSchema,
      onSubmitAsync: async ({ value: data }) => {
        const response = await registerService(data);

        if (!response.success) {
          if (response.error) toast.error(response.error);

          return {
            name: response.errors?.name,
            permissions: response.errors?.permissions,
          };
        }
      },
    },
    onSubmit: () => {
      setOpen(false);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const text = buffer.toString('utf-8');

      const data = yaml.load(text) as {
        service?: string;
        permissions?: string[];
      };

      setFileErrors([]);
      if (data.service) form.setFieldValue('name', data.service);
      if (data.permissions)
        form.setFieldValue('permissions', data.permissions || []);
    } catch {
      setFileErrors([{ message: 'Failed to parse file, please try again' }]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form id="register-service-form" onSubmit={form.handleSubmit}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogTitle>Register a service</DialogTitle>
          {!service && (
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="file">Upload config</FieldLabel>
                <Input
                  type="file"
                  id="file"
                  name="file"
                  accept=".yml,.yaml"
                  onChange={handleFileUpload}
                />
                <FieldError errors={fileErrors} />
                <FieldDescription>
                  <span>
                    Upload a YAML config file to prefill the form fields. A
                    valid format is like the following:
                  </span>
                  <br />
                  <code className="mt-2 w-full inline-block whitespace-break-spaces py-2 px-3 bg-gray-500/5 rounded-sm shadow-xs">
                    {
                      "service: my-service\npermissions:\n\t- key: 'service.write'\n\t  description: 'Modify all services'\n\t  scopes:\n\t\t- 'user'\n\t\t- 'api-key'"
                    }
                  </code>
                </FieldDescription>
              </Field>
            </FieldGroup>
          )}
          <FieldGroup>
            <form.Field
              name="name"
              // eslint-disable-next-line react/no-children-prop
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                      aria-invalid={isInvalid}
                      autoComplete="service-name"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="permissions"
              // eslint-disable-next-line react/no-children-prop
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Permissions</FieldLabel>
                    <PermissionsInput />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="register-service-form">
              Add Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
