import { UUID } from 'node:crypto';

type EditServicePageProps = {
  params: Promise<{ id: 'add' | `${UUID}_${UUID}` }>;
};

export default async function EditServicePage({
  params,
}: EditServicePageProps) {
  const { id } = await params;

  return <div>EditServicePage: {id}</div>;
}
