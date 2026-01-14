'use client';

import { requestEmailVerification } from '@/actions/email';
import { Button } from '@/components/ui/button';
import React from 'react';
import { toast } from 'sonner';

export default function EmailVerificationSendForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await requestEmailVerification();

    if (!response.success) {
      toast.error(response.error);
    } else {
      toast.success('Check your email!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button variant="default" type="submit">
        Re-send Verification
      </Button>
    </form>
  );
}
