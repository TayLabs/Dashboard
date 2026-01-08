'use client';

import {
  registerService,
  removeService,
  updateService,
} from '@/actions/services';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from '@tanstack/react-form';
import React, { useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import yaml from 'js-yaml';
import { Service } from '@/actions/types/interface/Service.interface';
import { useRouter, useSearchParams } from 'next/navigation';
import PermissionsFormDialog from './PermissionsFormDialog';
import { DialogTrigger } from '@/components/ui/dialog';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyTitle,
} from '@/components/ui/empty';
import { PlusIcon, Trash2Icon } from 'lucide-react';

const editServiceFormSchema = z.object({
  service: z.string().min(1, 'Service name is required'),
  permissions: z.array(
    z.object({
      key: z.string().min(1, 'Key is required for a permission'),
      description: z
        .string()
        .min(1, 'Description is required for a permission'),
      scopes: z.array(z.union([z.literal('user'), z.literal('api-key')])),
    })
  ),
});

export default function EditServiceForm({
  service,
}: Readonly<{ service?: Service }>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [fileErrors, setFileErrors] = useState<{ message?: string }[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const form = useForm({
    defaultValues: {
      service: service?.name || searchParams.get('name') || '',
      permissions:
        (service?.permissions as {
          key: string;
          description: string;
          scopes: ('api-key' | 'user')[];
        }[]) || [],
    },
    validators: {
      onSubmit: editServiceFormSchema,
      onSubmitAsync: async ({ value: data }) => {
        const response = !service
          ? await registerService(data)
          : await updateService(service.name, data);

        if (!response.success) {
          if (response.error) toast.error(response.error);

          return {
            service: response.errors?.service,
            permissions: response.errors?.permissions,
          };
        }
      },
    },
    onSubmit: () => {
      toast.success('Changes have been saved');
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
        permissions?: {
          key: string;
          description: string;
          scopes: ('api-key' | 'user')[];
        }[];
      };

      setFileErrors([]);
      if (data.service) form.setFieldValue('service', data.service);
      if (data.permissions)
        form.setFieldValue('permissions', data.permissions || []);
    } catch {
      setFileErrors([{ message: 'Failed to parse file, please try again' }]);
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const response = await removeService(service!.name);

    if (!response.success) {
      toast.error(response.error);
    } else {
      router.push('/services');
    }
  };

  return (
    <div className="mt-4">
      <form
        id="edit-service-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4">
        {!service && (
          <>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="file">Upload</FieldLabel>
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
            <FieldSeparator />
          </>
        )}
        <FieldGroup className="mb-4">
          <form.Field
            name="service"
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
                    disabled={service ? !service?.isExternal : false}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
      </form>
      <form.Field
        name="permissions"
        // eslint-disable-next-line react/no-children-prop
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              {/* <form.Field
                key={i}
                name={`permissions[${i}]`}
                // eslint-disable-next-line react/no-children-prop
                children={(subField) => ( */}
              <PermissionsFormDialog
                values={field.state.value}
                selectedIndex={selectedIndex}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  if (selectedIndex >= 0)
                    field.setValue([
                      ...field.state.value.slice(0, selectedIndex),
                      e.target.value,
                      ...field.state.value.slice(selectedIndex + 1),
                    ]);
                  else field.pushValue(e.target.value);
                }}>
                <FieldLabel>Permissions</FieldLabel>
                {field.state.value.length > 0 ? (
                  field.state.value.map((permission) => (
                    <Item key={permission.key} variant="outline">
                      <ItemContent>
                        <ItemTitle>
                          <code className="bg-muted px-2 rounded-sm shadow-xs text-base">
                            {permission.key}
                          </code>
                        </ItemTitle>
                        <ItemDescription className="ml-1 line-clamp-1">
                          {permission.description}
                        </ItemDescription>
                      </ItemContent>
                      {(service && !service?.isExternal) || ( // Make sure that the service is external before allowing permissions to be edited
                        <ItemActions>
                          <DialogTrigger
                            asChild
                            onClick={() => {
                              setSelectedIndex(
                                field.state.value.findIndex(
                                  (perm) => perm.key === permission.key
                                )
                              );
                            }}>
                            <Button variant="default">Edit</Button>
                          </DialogTrigger>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-700"
                            onClick={() => {
                              field.setValue((prev) =>
                                prev.filter(
                                  (_, i) =>
                                    i !==
                                    field.state.value.findIndex(
                                      (perm) => perm.key === permission.key
                                    )
                                )
                              );
                            }}>
                            <Trash2Icon />
                          </Button>
                        </ItemActions>
                      )}
                    </Item>
                  ))
                ) : (
                  <Empty>
                    <EmptyContent>
                      <EmptyTitle>No permissions for this service</EmptyTitle>
                      <EmptyDescription>
                        Add permissions to setup Role Based access control with
                        your service
                      </EmptyDescription>
                    </EmptyContent>
                  </Empty>
                )}
                {/* ... Permission displays and <DialogTrigger />s */}
                {(service && !service?.isExternal) || (
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedIndex(-1)}>
                      <PlusIcon />
                      <span>Add a permission</span>
                    </Button>
                  </DialogTrigger>
                )}
              </PermissionsFormDialog>
              {/* )}
              /> */}
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
      {(service && !service?.isExternal) || (
        <form.Subscribe
          selector={(formState) => [
            formState.canSubmit,
            formState.isSubmitting,
          ]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              form="edit-service-form"
              className="mt-4 w-full"
              disabled={!canSubmit}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          )}
        </form.Subscribe>
      )}
      {service && service?.isExternal && (
        <Button
          variant="destructive"
          className="mt-4 w-full"
          onClick={handleDelete}>
          Delete
        </Button>
      )}
    </div>
  );
}
