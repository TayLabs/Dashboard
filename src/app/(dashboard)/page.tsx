import Heading from './components/Heading';
import { Button } from '@/components/ui/button';
import { isAuthenticated } from '@/lib/auth';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { FolderCodeIcon } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  await isAuthenticated();

  return (
    <div className="container max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
      <Heading />
      <section id="services">
        <h2 className="text-2xl font-semibold mb-4">Your linked services</h2>
        <Empty className="bg-muted">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="p-8 bg-background shadow-sm">
              <FolderCodeIcon className="size-8" />
            </EmptyMedia>
            <EmptyTitle>No Projects Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any projects yet. Get started by creating
              your first project.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/services/add">
              <Button>Register a service</Button>
            </Link>
          </EmptyContent>
        </Empty>
      </section>
    </div>
  );
}
