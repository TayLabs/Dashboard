'use client';

import { Service } from '@/actions/types/interface/Service.interface';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { UUID } from 'node:crypto';
import React, { use } from 'react';

export default function PermissionsInput({
  getAllServicesPromise,
  scope,
  value,
  onChange,
  onBlur,
  disabled,
}: Readonly<{
  getAllServicesPromise: Promise<
    { success: true; services: Service[] } | { success: false; error: string }
  >;
  scope: 'api-key' | 'user';
  value: UUID[];
  onChange: (id: UUID, action: 'add' | 'delete') => void;
  onBlur: () => void;
  disabled?: boolean;
}>) {
  const response = use(getAllServicesPromise);

  if (!response.success) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error fetching permissions, try refreshing</AlertTitle>
        <AlertDescription>{response.error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-12">
      {response.services.map((service) => {
        const permissions = service.permissions.filter((permission) =>
          scope === 'user' ? permission.authId : permission.keysId
        );
        return (
          permissions.length > 0 && (
            <React.Fragment key={service.name}>
              <div className="grid gap-4">
                <h5 className="text-xl font-medium">
                  <code className="bg-muted px-3 rounded-sm">
                    {service.name}
                  </code>
                  <span>&nbsp;service</span>
                </h5>
                {permissions
                  .filter((permission) =>
                    scope === 'user' ? !!permission.authId : !!permission.keysId
                  )
                  .map((permission) => (
                    <div
                      key={permission.authId}
                      className="flex items-start gap-3">
                      <Checkbox
                        id={`${
                          scope === 'user'
                            ? permission.authId!
                            : permission.keysId!
                        }-${permission.key}`}
                        name={`${
                          scope === 'user'
                            ? permission.authId!
                            : permission.keysId!
                        }-${permission.key}`}
                        checked={value.includes(permission.authId!)}
                        onCheckedChange={(checked) => {
                          onChange(
                            scope === 'user'
                              ? permission.authId!
                              : permission.keysId!,
                            checked ? 'add' : 'delete'
                          );
                          onBlur();
                        }}
                        disabled={disabled}
                      />
                      <div className="grid gap-2">
                        <Label
                          htmlFor={`${
                            scope === 'user'
                              ? permission.authId!
                              : permission.keysId!
                          }-${permission.key}`}>
                          {permission.key}
                        </Label>
                        <p className="text-muted-foreground text-sm line-clamp-1">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </React.Fragment>
          )
        );
      })}
    </div>
  );
}
