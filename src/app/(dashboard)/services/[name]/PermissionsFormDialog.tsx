'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import z from 'zod';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';

const editServiceFormSchema = z.object({
  key: z.string().min(1, 'Key is required for a permission'),
  description: z.string().min(1, 'Description is required for a permission'),
  scopes: z.array(z.union([z.literal('user'), z.literal('api-key')])),
});

export default function PermissionsFormDialog({
  children,
  values,
  selectedIndex,
  onBlur,
  onChange,
}: Readonly<{
  values: {
    key: string;
    description: string;
    scopes: ('api-key' | 'user')[];
  }[];
  selectedIndex: number;
  onBlur: () => void;
  onChange: (e: {
    target: {
      value: {
        key: string;
        description: string;
        scopes: ('api-key' | 'user')[];
      };
    };
  }) => void;
  children: React.ReactNode;
}>) {
  const value = selectedIndex >= 0 ? values[selectedIndex] : null;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm({
    defaultValues: {
      key: value?.key || '',
      description: value?.description || '',
      scopes: value?.scopes || [],
    },
    validators: {
      onSubmit: editServiceFormSchema,
    },
    onSubmit: ({ value }) => {
      onChange({ target: { value } });
      onBlur();
      setIsOpen(false);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <form
        id="edit-permission-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}>
        <DialogContent>
          <DialogTitle>
            {!value ? 'Add a permission' : `Edit ${value.key} permission`}
          </DialogTitle>
          <form.Field
            name="key"
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Key</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                    aria-invalid={isInvalid}
                    autoComplete="permission-name"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="description"
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                    aria-invalid={isInvalid}
                    className="max-h-60 sm:max-h-100 h-30"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="scopes"
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Scopes</FieldLabel>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                      <Checkbox
                        id="toggle-user"
                        defaultChecked={field.state.value.includes('user')}
                        onCheckedChange={(e) => {
                          if (e.valueOf()) {
                            field.state.value.push('user');
                          } else {
                            field.state.value.splice(
                              field.state.value.findIndex(
                                (value) => value === 'user'
                              ),
                              1
                            );
                          }
                          console.log(field.state.value);
                        }}
                        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                      />
                      <div className="grid gap-1.5 font-normal">
                        <p className="text-sm leading-none font-medium">
                          User Permission
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Available for adding to roles.
                        </p>
                      </div>
                    </Label>
                    <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                      <Checkbox
                        id="toggle-api-key"
                        defaultChecked={field.state.value.includes('api-key')}
                        onCheckedChange={(e) => {
                          if (e.valueOf()) {
                            field.state.value.push('api-key');
                          } else {
                            field.state.value.splice(
                              field.state.value.findIndex(
                                (value) => value === 'api-key'
                              ),
                              1
                            );
                          }
                          console.log(field.state.value);
                        }}
                        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                      />
                      <div className="grid gap-1.5 font-normal">
                        <p className="text-sm leading-none font-medium">
                          Api Key Permission
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Available for adding to api keys.
                        </p>
                      </div>
                    </Label>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="edit-permission-form">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
