'use client';

import { useUser } from '@/hooks/useUser';

export default function Heading() {
  const { user } = useUser();

  if (!user) return <></>;

  return (
    <section>
      <h1 className="text-4xl font-medium mb-4">
        {`Good Morning, ${user?.profile.displayName}`}
      </h1>
      <p className="text-muted-foreground">{`Here's what's going on today`}</p>
    </section>
  );
}
