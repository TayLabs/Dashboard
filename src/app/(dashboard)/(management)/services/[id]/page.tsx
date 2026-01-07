import { UUID } from 'node:crypto';

type EditServicePageProps = {
	params: Promise<{ id: 'add' | `${UUID}_${UUID}` }>;
};

const uuidRegex =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function EditServicePage({
	params,
}: EditServicePageProps) {
	const { id, isAdd } = await params.then(
		({ id }): { id?: UUID[]; isAdd?: boolean } => {
			if (id === 'add') {
				return { isAdd };
			} else if (uuidRegex.test(id)) {
				return { id: [id] };
			} else if (id.split('_').every((uuid) => uuidRegex.test(uuid))) {
				const [first, second] = id.split('_');

				return {
					id: [first as UUID, second as UUID],
				};
			}

			return {};
		}
	);

  const response = await getService(id)

	return <div>EditServicePage: {id}</div>;
}
