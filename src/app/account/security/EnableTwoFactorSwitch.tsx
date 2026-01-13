'use client';

import { toggleTwoFactor } from '@/actions/users';
import { Field, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { toast } from 'sonner';

export default function EnableTwoFactorSwitch({
  disabled,
}: Readonly<{ disabled?: boolean }>) {
  const [value, setValue] = useState(false);

  const handleCheck = async (isChecked: boolean) => {
    if (!disabled) {
      const response = await toggleTwoFactor(isChecked);

      if (!response.success) {
        toast.error(response.error);
      } else {
        setValue(isChecked);
        toast.success('Two-Factor authentication has been enabled');
      }
    }
  };

  return (
    <Field orientation="horizontal" className="w-fit">
      <FieldLabel htmlFor="2fa-enable">Enable Two Factor</FieldLabel>
      <Switch id="2fa-enable" checked={value} onCheckedChange={handleCheck} />
    </Field>
  );
}
