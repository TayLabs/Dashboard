'use client';

import { removeTOTP } from '@/actions/totp';
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { UUID } from 'node:crypto';
import { toast } from 'sonner';

export default function RemoveTwoFactorMethod({
  totpTokenId,
}: Readonly<{ totpTokenId: UUID }>) {
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const response = await removeTOTP(totpTokenId);

    if (!response.success) {
      toast.error(response.error);
    }

    router.refresh();
  };

  return (
    <Button
      variant="destructive"
      size="icon"
      className="bg-transparent hover:bg-red-600/5 border border-red-600 text-red-600"
      onClick={handleClick}>
      <Trash2Icon />
    </Button>
  );
}
