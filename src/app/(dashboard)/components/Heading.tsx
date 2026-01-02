'use client';

import { useUser } from '@/hooks/useUser';

export default function Heading() {
  const { user } = useUser();

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">
        Good Morning{`, ${user?.profile.displayName}`}
      </h1>
      <p>{`Here's what's going on today`}</p>
    </section>
  );
}
