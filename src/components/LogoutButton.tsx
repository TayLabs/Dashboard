'use client';

import { logout } from '@/actions/auth';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { LogOutIcon } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  return (
    <Button
      onClick={async (e) => {
        e.preventDefault();
        const response = await logout();

        if (!response.success) {
          toast.error(response.error);
        } else {
          router.push('/auth/login');
        }
      }}
      variant="outline">
      <LogOutIcon />
      <span>Logout</span>
    </Button>
  );
}
