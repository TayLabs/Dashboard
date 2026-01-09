'use client';

import { Role } from '@/actions/types/interface/Role';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { UUID } from 'node:crypto';

export default function RolesInput({
  roles,
  value,
  onChange,
  onBlur,
  disabled,
}: Readonly<{
  roles: Role[];
  value: UUID[];
  onChange: (id: UUID, action: 'add' | 'delete') => void;
  onBlur: () => void;
  disabled?: boolean;
}>) {
  return (
    <div className="grid gap-12">
      {roles.map((role) => (
        <div key={role.id} className="flex items-start gap-3">
          <Checkbox
            id={`${role.id}-${role.name}`}
            name={`${role.id}-${role.name}`}
            checked={value.includes(role.id)}
            onCheckedChange={(checked) => {
              onChange(role.id, checked ? 'add' : 'delete');
              onBlur();
            }}
            disabled={disabled}
          />
          <div className="grid gap-2">
            <Label htmlFor={`${role.id}-${role.name}`}>{role.name}</Label>
          </div>
        </div>
      ))}
    </div>
  );
}
